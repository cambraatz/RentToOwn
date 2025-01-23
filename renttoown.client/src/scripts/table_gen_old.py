import sys
import argparse
import json

import sqlite3
from sqlite3 import Error

import numpy as np
import scipy.optimize
#import numpy_financial as npf
import pandas as pd
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta

def getDateTime():
    start_time = datetime.today()
    start_date = start_time.strftime("%m/%Y")

    end_time = start_time + relativedelta(months=360)
    end_date = end_time.strftime("%m/%Y")
    return start_date,end_date

class PurchaseAssumptions:
    def __init__(self,purchase_price,hold_period):
        self.purchase_price = purchase_price
        self.hold_period = hold_period
        self.hold_period_m = self.hold_period * 12

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class RentAssumptions:
    def __init__(self,apartment_rent,parking_rent,renters_insurance):
        self.apartment_rent = apartment_rent
        self.parking_rent = parking_rent
        self.renters_insurance = renters_insurance
        self.monthly_rent = self.apartment_rent + self.parking_rent

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class GeneralAssumptions:
    def __init__(self,rate_capital_gains,rate_federal_tax,bool_federal,salt_limit,bool_salt,rent_growth,home_appreciation,ret_inflation,other_inflation):
        self.rate_capital_gains = rate_capital_gains
        self.rate_federal_tax = rate_federal_tax
        self.bool_federal = bool_federal
        self.salt_limit = salt_limit
        self.bool_salt = bool_salt
        self.rent_growth = rent_growth
        self.home_appreciation = home_appreciation
        self.ret_inflation = ret_inflation
        self.other_inflation = other_inflation

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class AcquisitionCosts:
    def __init__(self,purchase_assumptions,fee_inspection,fee_appraisal,fee_legal,rate_title_insurance_aq,lender_costs_other,rate_transfer_tax_aq):
        self.fee_inspection = fee_inspection
        self.fee_appraisal = fee_appraisal
        self.fee_legal = fee_legal
        self.rate_title_insurance_aq = rate_title_insurance_aq
        self.title_insurance_aq = (rate_title_insurance_aq/100) * purchase_assumptions.purchase_price
        self.lender_costs_other = lender_costs_other
        self.rate_transfer_tax_aq = rate_transfer_tax_aq
        self.transfer_tax_aq = (rate_transfer_tax_aq/100) * purchase_assumptions.purchase_price
        self.total_acquisition = fee_inspection + fee_appraisal + fee_legal + self.title_insurance_aq + lender_costs_other + self.transfer_tax_aq

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class DispositionCosts:
    def __init__(self,gross_sale_30y,rate_title_insurance_dis,rate_transfer_tax_dis,rate_brokerage):
        self.rate_title_insurance_dis = rate_title_insurance_dis
        self.title_insurance_dis = (rate_title_insurance_dis/100) * gross_sale_30y
        self.rate_transfer_tax_dis = rate_transfer_tax_dis
        self.transfer_tax_dis = (rate_transfer_tax_dis/100) * gross_sale_30y
        self.rate_brokerage = rate_brokerage
        self.fee_brokerage = (rate_brokerage/100) * gross_sale_30y
        self.total_disposition = self.title_insurance_dis + self.transfer_tax_dis + self.fee_brokerage

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class OperatingCosts:
    def __init__(self,purchase_assumptions,rate_property_tax,rate_home_insurance,rate_home_maintenance,rate_hoa_util):
        self.rate_property_tax = rate_property_tax
        self.property_tax = (rate_property_tax/100) * purchase_assumptions.purchase_price
        self.rate_home_insurance = rate_home_insurance
        self.home_insurance = (rate_home_insurance/100) * purchase_assumptions.purchase_price
        self.rate_home_maintenance = rate_home_maintenance
        self.home_maintenance = (rate_home_maintenance/100) * purchase_assumptions.purchase_price
        self.rate_hoa_util = rate_hoa_util
        self.hoa_util = ((rate_hoa_util/100) * purchase_assumptions.purchase_price)/12

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class LoanAssumptions:
    def __init__(self,purchase_assumptions,rate_ltv_max,loan_ltv_max,rate_home_loan,amort_home_loan,rate_mortgage_insurance,clear_mortgage_insurance,rate_mortgage_points):
        self.rate_ltv_max = rate_ltv_max
        self.loan_ltv_max = loan_ltv_max
        self.loan_ltv_desired = min(purchase_assumptions.purchase_price*(rate_ltv_max/100), loan_ltv_max)
        self.rate_ltv_desired = (self.loan_ltv_desired/purchase_assumptions.purchase_price)*100
        self.rate_home_loan = rate_home_loan
        self.amort_home_loan = amort_home_loan
        self.rate_mortgage_insurance = rate_mortgage_insurance
        self.clear_mortgage_insurance = clear_mortgage_insurance
        self.rate_mortgage_points = rate_mortgage_points
        self.mortgage_points = (rate_mortgage_points/100) * self.loan_ltv_desired

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

class Query:
    def __init__(self,purchase_assumptions,rent_assumptions,general_assumptions,acquisition_costs,disposition_costs,operating_costs,loan_assumptions):
        self.purchase_price = purchase_assumptions.purchase_price
        self.hold_period = purchase_assumptions.hold_period
        self.hold_period_m = self.hold_period * 12

        self.apartment_rent = rent_assumptions.apartment_rent
        self.parking_rent = rent_assumptions.parking_rent
        self.renters_insurance = rent_assumptions.renters_insurance
        self.monthly_rent = rent_assumptions.monthly_rent

        self.rate_capital_gains = general_assumptions.rate_capital_gains
        self.rate_federal_tax = general_assumptions.rate_federal_tax
        self.bool_federal = general_assumptions.bool_federal
        self.salt_limit = general_assumptions.salt_limit
        self.bool_salt = general_assumptions.bool_salt
        self.rent_growth = general_assumptions.rent_growth
        self.home_appreciation = general_assumptions.home_appreciation
        self.ret_inflation = general_assumptions.ret_inflation
        self.other_inflation = general_assumptions.other_inflation
        
        self.fee_inspection = acquisition_costs.fee_inspection
        self.fee_appraisal = acquisition_costs.fee_appraisal
        self.fee_legal = acquisition_costs.fee_legal
        self.rate_title_insurance_aq = acquisition_costs.rate_title_insurance_aq
        self.title_insurance_aq = acquisition_costs.title_insurance_aq
        self.lender_costs_other = acquisition_costs.lender_costs_other
        self.rate_transfer_tax_aq = acquisition_costs.rate_transfer_tax_aq
        self.transfer_tax_aq = acquisition_costs.transfer_tax_aq
        self.total_acquisition = acquisition_costs.total_acquisition

        self.rate_title_insurance_dis = disposition_costs.rate_title_insurance_dis
        self.title_insurance_dis = disposition_costs.title_insurance_dis
        self.rate_transfer_tax_dis = disposition_costs.rate_transfer_tax_dis
        self.transfer_tax_dis = disposition_costs.transfer_tax_dis
        self.rate_brokerage = disposition_costs.rate_brokerage
        self.fee_brokerage = disposition_costs.fee_brokerage
        self.total_disposition = disposition_costs.total_disposition

        self.rate_property_tax = operating_costs.rate_property_tax
        self.property_tax = operating_costs.property_tax
        self.rate_home_insurance = operating_costs.rate_home_insurance
        self.home_insurance = operating_costs.home_insurance
        self.rate_home_maintenance = operating_costs.rate_home_maintenance
        self.home_maintenance = operating_costs.home_maintenance
        self.rate_hoa_util = operating_costs.rate_hoa_util
        self.hoa_util = operating_costs.hoa_util

        self.rate_ltv_max = loan_assumptions.rate_ltv_max
        self.loan_ltv_max = loan_assumptions.loan_ltv_max
        self.loan_ltv_desired = loan_assumptions.loan_ltv_desired
        self.rate_ltv_desired = loan_assumptions.rate_ltv_desired
        self.rate_home_loan = loan_assumptions.rate_home_loan
        self.amort_home_loan = loan_assumptions.amort_home_loan
        self.rate_mortgage_insurance = loan_assumptions.rate_mortgage_insurance
        self.clear_mortgage_insurance = loan_assumptions.clear_mortgage_insurance
        self.rate_mortgage_points = loan_assumptions.rate_mortgage_points
        self.mortgage_points = loan_assumptions.mortgage_points

        self.months,self.years = self.set_months()

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

    def set_months(self):
        # initialize the header lists for input later, standard incremental months/years...
        months = list(range(self.hold_period_m+1))
        years = np.zeros(self.hold_period_m+1)
        #acf_months = np.zeros((self.hold_period_m+1)//12)

        for i in range(len(months)):
            years[i] = np.ceil(months[i]/12)

        #print(f"months: {months}\nyears: {years}\nacf_months: {acf_months}")
        return months,years#,acf_months
    
class MonthlyRentCashFlow:
    def __init__(self,query):
        self.mcf_month = 1
        self.mcf_year = 0
        self.mcf_rent = self.mcf_rent_func(self.mcf_month, self.mcf_year, query.hold_period_m, query.monthly_rent, query.rent_growth)
        self.mcf_rent_insur = self.mcf_rent_func(self.mcf_month, self.mcf_year, query.hold_period_m, (query.renters_insurance / 12), query.rent_growth)
        self.mcf_rent_cashflow, self.mcf_net_rent = self.calc_cashflow(query)
        self.total_rcf = np.sum(self.mcf_rent_cashflow)

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

    def mcf_rent_func(self, month, year, hold_period_m, monthly_rent, rent_growth):
        rent = np.zeros(hold_period_m+1)
        for i in range(1, hold_period_m+1):
            year = month//12            
            if month>0 and month<=hold_period_m:
                if month == 1:
                    rent[i] = rent[i-1] - monthly_rent
                    month += 1
                else:
                    if year==(month-1)/12: #asks if previous month was last year...
                        rent[i] = round(rent[i-1] * (1 + (rent_growth/100)), 2) #adjusts rent per annual growth
                        #rent[i] = rent[i-1] * (1 + (rent_growth/100)) #adjusts rent per annual growth
                        month += 1
                    else:
                        rent[i] = rent[i-1]
                        month += 1
        return rent
    
    def calc_cashflow(self,query):
        mcf_rent_cashflow = np.zeros(query.hold_period_m+1)
        mcf_net_rent = np.zeros(query.hold_period_m+1)
        for i in range(query.hold_period_m+1):
            # These two lines populate flat rate renter's insurance, comment out for appreciation...
            #if i > 0:
                #mcf_rent_insur[i] = renters_insurance/12
            mcf_rent_cashflow[i] = self.mcf_rent[i] + self.mcf_rent_insur[i]

            if i>0:
                mcf_net_rent[i] = mcf_net_rent[i-1] + self.mcf_rent[i] + self.mcf_rent_insur[i]

        return mcf_rent_cashflow, mcf_net_rent
    
    def mcf_rent_dataframe(self,query,transpose=False):
        mcf_rent_dict = {"Years": query.years,
                    "Months": query.months,
                    "Monthly Rent": self.mcf_rent,
                    "Renter's Insurance": self.mcf_rent_insur,
                    "Renter's Cash Flow": self.mcf_rent_cashflow,
                    "Net Rent": self.mcf_net_rent}

        if transpose:
            mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"]).transpose()
        else:
            mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])

        return mcf_rent_table
    
class MonthlyUnleveredCashFlow:
    def __init__(self,query,mcf_rent_cashflow):
        duration = query.hold_period_m

        self.mcf_month = 1
        self.mcf_year = 0

        self.mcf_acquis = np.zeros(duration+1)
        self.mcf_acquis[0] = -query.purchase_price
        self.mcf_acquis_costs = np.zeros(duration+1)
        self.mcf_acquis_costs[0] = -query.total_acquisition
        self.mcf_sale = np.zeros(duration+1)

        self.mcf_dispo_costs = np.zeros(duration+1)
        self.mcf_unlv_own_cf = np.zeros(duration+1)
        self.mcf_unlv_net_cf = np.zeros(duration+1)
        self.total = np.zeros(duration+1)

        self.mcf_sale[duration] = query.purchase_price*(1 + (query.home_appreciation/100))**query.hold_period
        self.mcf_dispo_costs[duration] = -(0.055 * self.mcf_sale[duration])

        self.mcf_prop_tax = self.mcf_own_func(self.mcf_month, self.mcf_year, duration, query.property_tax, query.ret_inflation)

        self.mcf_prop_tax_shield = self.mcf_pts_func(query.bool_salt, query.salt_limit, query.bool_federal, query.rate_federal_tax, self.mcf_prop_tax, duration)

        self.mcf_insurance = self.mcf_own_func(self.mcf_month, self.mcf_year, duration, query.home_insurance, query.other_inflation)
        self.mcf_maintenance = self.mcf_own_func(self.mcf_month, self.mcf_year, duration, query.home_maintenance, query.other_inflation)
        self.mcf_hoa_dues = self.mcf_own_func(self.mcf_month, self.mcf_year, duration, query.hoa_util*12, query.other_inflation)

        self.mcf_unlv_own_cf[0] = self.total[0] = np.sum((self.mcf_acquis[0],self.mcf_acquis_costs[0]))
        self.mcf_unlv_net_cf[0] = np.subtract(self.mcf_unlv_own_cf[0],mcf_rent_cashflow[0])

        for i in range(1,duration+1):
            if i < duration:
                self.mcf_unlv_own_cf[i] = np.sum((self.mcf_dispo_costs[i],self.mcf_prop_tax[i],self.mcf_prop_tax_shield[i],self.mcf_insurance[i],self.mcf_maintenance[i],self.mcf_hoa_dues[i]))
                self.mcf_unlv_net_cf[i] = np.subtract(self.mcf_unlv_own_cf[i],mcf_rent_cashflow[i])
                self.total[i] = self.total[i-1] + self.mcf_unlv_own_cf[i]
            else:
                self.mcf_unlv_own_cf[i] = np.sum((self.mcf_dispo_costs[i],self.mcf_prop_tax[i],self.mcf_prop_tax_shield[i],self.mcf_insurance[i],self.mcf_maintenance[i],self.mcf_hoa_dues[i]))
                self.mcf_unlv_own_cf[i] = np.sum([self.mcf_unlv_own_cf[i], self.mcf_sale[i]])
                self.mcf_unlv_net_cf[i] = np.subtract(self.mcf_unlv_own_cf[i],mcf_rent_cashflow[i])
                self.total[i] = self.total[i-1] + self.mcf_unlv_own_cf[i]
        
        self.gross_sale_30y = np.sum(self.mcf_sale)
        self.total_mucf = np.sum(self.mcf_unlv_own_cf)

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

    # Computes various rent appreciations across study period...
    def mcf_own_func(self, month, year, hold_period_m, tax, inflation):
        own_list = np.zeros(hold_period_m+1)
        for i in range(1, hold_period_m+1):
            year = np.ceil(month/12)
            if month>0 and month<=hold_period_m:
                own_list[i] = -(tax/12)*((1 + inflation/100)**(year-1))
            month += 1
        return own_list

    # Computes property tax shield across study period...
    def mcf_pts_func(self, bool_salt, salt_limit, bool_federal, rate_federal_tax, mcf_prop_tax, hold_period_m):
        pts = np.zeros(hold_period_m+1)
        for i in range(1, hold_period_m+1):
            if bool_salt:
                pts[i] = min(-mcf_prop_tax[i], salt_limit/12)
            else:
                pts[i] = -mcf_prop_tax[i]
            if bool_federal:
                pts[i] = pts[i] * (rate_federal_tax/100)
        return pts
    
    def mcf_unlevered_dataframe(self,query,transpose=False):
        mcf_own_dict = {"Years": query.years,
                    "Months": query.months,
                    "Acquisition": self.mcf_acquis,
                    "Acquisition Costs": self.mcf_acquis_costs,
                    "Sale": self.mcf_sale,
                    "Disposition Costs": self.mcf_dispo_costs,
                    "Property Tax": self.mcf_prop_tax,
                    "Property Tax Shield": self.mcf_prop_tax_shield,
                    "Insurance": self.mcf_insurance,
                    "Maintenance": self.mcf_maintenance,
                    "Condo Dues": self.mcf_hoa_dues,
                    "Unlevered Owner Cash Flow": self.mcf_unlv_own_cf,
                    "Unlevered Net Cash Flow": self.mcf_unlv_net_cf,
                    "Unlevered Total": self.total}
        
        if transpose:
            mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"]).transpose()
        else:
            mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"])

        return mcf_own_table
    
class MonthlyLeveredCashFlow:
    def __init__(self,query,mcf_rent_cashflow,mucf):
        duration = query.hold_period_m

        self.mcf_month = 1
        self.mcf_year = 0

        self.mcfl_loan_proc = np.zeros(duration+1)
        self.mcfl_loan_repay = np.zeros(duration+1)
        self.mcfl_loan_points = np.zeros(duration+1)
        self.mcfl_amort = np.zeros(duration+1)
        self.mcfl_interest = np.zeros(duration+1)
        self.mcfl_interest_tax_shield = np.zeros(duration+1)
        self.mcfl_mortgage_insurance = np.zeros(duration+1)
        self.mcfl_lv_own_cf = np.zeros(duration+1)
        self.mcfl_lv_net_cf = np.zeros(duration+1)
        self.gross_total = np.zeros(duration+1)
        self.net_total = np.zeros(duration+1)

        self.mcfl_loan_proc[0] = query.loan_ltv_desired
        self.mcfl_loan_points[0] = -query.mortgage_points

        #self.mcfl_lv_ge[0] = self.mcfl_net[0] = np.sum([mcf_unlv_own_cf[0], mcfl_loan_proc[0], mcfl_loan_repay[0], mcfl_amort[0], mcfl_loan_points[0], mcfl_interest[0], mcfl_interest_tax_shield[0], mcfl_mortgage_insurance[0]])
        #self.mcfl_lv_ne[0] =self.mcfl_lv_own_cf[0] - self.mcf_rent_cashflow[0]

        # pull out any rate adjustment operations, need to gain back some efficiency here...
        month = 0
        for i in range(duration+1):
            if month > 0 and month <= duration:
                self.mcfl_interest[i] = -np.round(np.sum([self.mcfl_loan_proc[:i], self.mcfl_loan_repay[:i], self.mcfl_amort[:i]]),2) * (query.rate_home_loan/100/12)
                self.mcfl_amort[i] = -self.pmt_func(query.rate_home_loan/100, query.amort_home_loan, query.purchase_price*query.rate_ltv_desired/100)/12 - self.mcfl_interest[i]
                self.mcfl_interest_tax_shield[i] = -self.mcfl_interest[i] * query.rate_federal_tax/100
                self.mcfl_mortgage_insurance[i] = -((query.rate_mortgage_insurance/100)/12) * np.max(query.purchase_price*(query.rate_ltv_desired/100 - query.clear_mortgage_insurance/100),0) * \
                                            ((np.sum([self.mcfl_loan_proc[:i], self.mcfl_loan_repay[:i], self.mcfl_amort[:i]]) - query.purchase_price*query.clear_mortgage_insurance/100) > 0)
                #mcfl_lv_ge[i] = mcfl_lv_ge[i-1] + mcfl_lv_own_cf[i]
                if month == duration:
                    self.mcfl_loan_repay[-1] = -(np.sum(self.mcfl_amort) + self.mcfl_loan_proc[0])

            self.mcfl_lv_own_cf[i] = np.sum([mucf.mcf_unlv_own_cf[i],self.mcfl_loan_proc[i],self.mcfl_loan_repay[i],self.mcfl_amort[i],self.mcfl_loan_points[i],self.mcfl_interest[i],self.mcfl_interest_tax_shield[i],self.mcfl_mortgage_insurance[i]])
            self.mcfl_lv_net_cf[i] = self.mcfl_lv_own_cf[i] - mcf_rent_cashflow[i]

            if month == 0:
                self.gross_total[i] = self.mcfl_lv_own_cf[i]
                self.net_total[i] = self.mcfl_lv_net_cf[i]
            else:
                self.gross_total[i] = self.gross_total[i-1] + self.mcfl_lv_own_cf[i]
                self.net_total[i] = self.net_total[i-1] + self.mcfl_lv_net_cf[i]

            month +=1

        self.mcfl_loan_repay[-1] = -(np.sum(self.mcfl_amort) + self.mcfl_loan_proc[0])

    def __str__(self):
        for key,value in vars(self).items():
            print(f"{key}: {value}")

    def pmt_func(self, rate, nper, pv):
        #rate = rate/100
        return pv * (rate) / (1 - (1 + rate)**(-nper))
    
    def mcf_levered_dataframe(self,query,transpose=False):
        mcfl_own_dict = {"Years": query.years,
                    "Months": query.months,
                    "Loan Proceeds": self.mcfl_loan_proc,
                    "Loan Repayment": self.mcfl_loan_repay,
                    "Amortization": self.mcfl_amort,
                    "Loan Points": self.mcfl_loan_points,
                    "Interest": self.mcfl_interest,
                    "Interest Tax Shield": self.mcfl_interest_tax_shield,
                    "Mortgage Insurance": self.mcfl_mortgage_insurance,
                    "Levered Owner Cash Flow": self.mcfl_lv_own_cf,
                    "Levered Net Cash Flow": self.mcfl_lv_net_cf,
                    "Cum. Gross Equity": self.gross_total,
                    "Cum. Net Equity": self.net_total}
        
        if transpose:
            mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"]).transpose()
        else:
            mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"])

        return mcfl_own_table

def initialize(json):
    '''pa_params = {
        "purchase_price": 500000,
        "hold_period": 5
    }'''

    pa_params = {
        "purchase_price": json["price"],
        "hold_period": json["holding_y"],
    }
    

    PA = PurchaseAssumptions(**pa_params)
    #PA.__str__()

    #print("\nPurchase Price: ${}".format(PA.purchase_price))
    #print("Hold Period: {} years ({} month)".format(PA.hold_period,PA.hold_period_m))

    ra_params = {
        "apartment_rent": 3000,
        "parking_rent": 300,
        "renters_insurance": 600,
    }

    RA = RentAssumptions(**ra_params)
    #RA.__str__()

    #print(f"\nMonthly Rent: ${RA.monthly_rent}/month\nRenters Insurance: ${RA.renters_insurance}/year")

    ga_params = {
        "rate_capital_gains": 20,
        "rate_federal_tax": 35,
        "bool_federal": True,
        "salt_limit": 10000,
        "bool_salt": True,
        "rent_growth": 3,
        "home_appreciation": 3,
        "ret_inflation": 3,
        "other_inflation": 3
    }

    GA = GeneralAssumptions(**ga_params)
    #GA.__str__()

    ac_params = {
        "purchase_assumptions": PA,
        "fee_inspection": 1000,
        "fee_appraisal": 750,
        "fee_legal": 1500,
        "rate_title_insurance_aq": 0.5,
        "lender_costs_other": 2000,
        "rate_transfer_tax_aq": 0
    }

    AC = AcquisitionCosts(**ac_params)
    #AC.__str__()

    #print(f"\nTitle Insurance: ${AC.title_insurance_aq}\nTransfer Tax: ${AC.transfer_tax_aq}\nTotal Acquisition: ${AC.total_acquisition}")

    dc_params = {
        "gross_sale_30y": PA.purchase_price * (1 + ((GA.home_appreciation+GA.ret_inflation+GA.other_inflation)/100) ),
        "rate_title_insurance_dis": 0,
        "rate_transfer_tax_dis": 0,
        "rate_brokerage": 5.5,
    }

    DC = DispositionCosts(**dc_params)
    #DC.__str__()

    oc_params = {
        "purchase_assumptions": PA,
        "rate_property_tax": 0.6,
        "rate_home_insurance": 0.6,
        "rate_home_maintenance": 1,
        "rate_hoa_util": 0.25
    }

    OC = OperatingCosts(**oc_params)
    #OC.__str__()

    la_params = {
        "purchase_assumptions": PA,
        "rate_ltv_max": 80,
        "loan_ltv_max": 787750,
        "rate_home_loan": 7,
        "amort_home_loan": 30,
        "rate_mortgage_insurance": 5,
        "clear_mortgage_insurance": 80,
        "rate_mortgage_points": 1
    }

    LA = LoanAssumptions(**la_params)
    #LA.__str__()

    query = Query(PA,RA,GA,AC,DC,OC,LA)
    #query.__str__()

    return query

def main(query_input):
    #print(sys.executable)
    #print("Hello World!")
    
    # Convert the JSON string back to a dictionary
    input_json = json.loads(query_input)

    query = initialize(input_json)

    MCF = MonthlyRentCashFlow(query)
    MUCF = MonthlyUnleveredCashFlow(query, MCF.mcf_rent_cashflow)
    MLCF = MonthlyLeveredCashFlow(query, MCF.mcf_rent_cashflow, MUCF)
    
    #params = []
    #for key, value in query_dict.items():
        #print(f"{key}: {value}")
        #params.append(value)
    
    '''params = [
        query_dict["price"],
        query_dict["holding_y"],
        query_dict["holding_m"],
        query_dict["rent_m"],
        query_dict["rent_growth"],
        query_dict["rent_insur_m"],
        query_dict["federal_tax_bool"],
        query_dict["federal_tax_rate"],
        query_dict["salt_limit_bool"],
        query_dict["salt_limit"],
        query_dict["total_acquisition"],
        query_dict["home_price_appr"],
        query_dict["ret_inflation"],
        query_dict["other_inflation"],
        query_dict["total_disposition"],
        query_dict["property_tax"],
        query_dict["home_insurance"],
        query_dict["maintenance"],
        query_dict["hoa_util"],
        query_dict["desired_loan_ltv"],
        query_dict["desired_loan_rate"],
        query_dict["loan_rate"],
        query_dict["loan_amortization"],
        query_dict["mortgage_insur_rate"],
        query_dict["mortgage_insur_limit"],
        query_dict["mortgage_points"]
    ]'''

    derived_params = {
        "Years": query.years,
        "Months": query.months,
        "Monthly Rent": MCF.mcf_rent,
        "Renter's Insurance": MCF.mcf_rent_insur,
        "Renter's Cash Flow": MCF.mcf_rent_cashflow,
        "Acquisition": MUCF.mcf_acquis,
        "Acquisition Costs": MUCF.mcf_acquis_costs,
        "Sale": MUCF.mcf_sale,
        "Disposition Costs": MUCF.mcf_dispo_costs,
        "Property Tax": MUCF.mcf_prop_tax,
        "Property Tax Shield": MUCF.mcf_prop_tax_shield,
        "Insurance": MUCF.mcf_insurance,
        "Maintenance":MUCF. mcf_maintenance,
        "Condo Dues": MUCF.mcf_hoa_dues,
        "Unlevered Owner Cash Flow": MUCF.mcf_unlv_own_cf,
        "Unlevered Net Cash Flow": MUCF.mcf_unlv_net_cf,
        "Loan Proceeds": MLCF.mcfl_loan_proc,
        "Loan Repayment": MLCF.mcfl_loan_repay,
        "Amortization": MLCF.mcfl_amort,
        "Loan Points": MLCF.mcfl_loan_points,
        "Interest": MLCF.mcfl_interest,
        "Interest Tax Shield": MLCF.mcfl_interest_tax_shield,
        "Mortgage Insurance": MLCF.mcfl_mortgage_insurance,
        "Levered Owner Cash Flow": MLCF.mcfl_lv_own_cf,
        "Levered Net Cash Flow": MLCF.mcfl_lv_net_cf,
        "Cum. Gross Equity": MLCF.gross_total,
        "Cum. Net Equity": MLCF.net_total
    }

    results = {}

    for key, value in derived_params.items():
        # check if value is ndarry and convert if so...
        results[key] = value.tolist() if isinstance(value, np.ndarray) else value

    '''mcf_rent = MCF.mcf_rent.tolist() if isinstance(MCF.mcf_rent, np.ndarray) else MCF.mcf_rent
    mcf_rent_insur = MCF.mcf_rent_insur.tolist() if isinstance(MCF.mcf_rent_insur, np.ndarray) else MCF.mcf_rent_insur
    mcf_rent_cashflow = MCF.mcf_rent_cashflow.tolist() if isinstance(MCF.mcf_rent_cashflow, np.ndarray) else MCF.mcf_rent_cashflow
    
    results = {
        "mcf_rent": mcf_rent,
        "mcf_rent_insur": mcf_rent_insur,
        "mcf_rent_cashflow": mcf_rent_cashflow
    }'''
    
    print(json.dumps(results))

    return json.dumps(results)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process query parameters.")
    parser.add_argument("--query", type=str, required=True, help="JSON string representing the query parameter.")

    args = parser.parse_args()

    main(args.query)