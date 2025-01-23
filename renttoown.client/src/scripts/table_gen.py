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
    def __init__(self,pa,ra,ga,ac,dc,oc,la):
        self.PA = PurchaseAssumptions(**pa) 
        self.purchase_price = self.PA.purchase_price
        self.hold_period = self.PA.hold_period
        self.hold_period_m = self.PA.hold_period * 12

        self.RA = RentAssumptions(**ra)
        self.apartment_rent = self.RA.apartment_rent
        self.parking_rent = self.RA.parking_rent
        self.renters_insurance = self.RA.renters_insurance
        self.monthly_rent = self.RA.monthly_rent

        self.GA = GeneralAssumptions(**ga)
        self.rate_capital_gains = self.GA.rate_capital_gains
        self.rate_federal_tax = self.GA.rate_federal_tax
        self.bool_federal = self.GA.bool_federal
        self.salt_limit = self.GA.salt_limit
        self.bool_salt = self.GA.bool_salt
        self.rent_growth = self.GA.rent_growth
        self.home_appreciation = self.GA.home_appreciation
        self.ret_inflation = self.GA.ret_inflation
        self.other_inflation = self.GA.other_inflation
        
        self.AC = AcquisitionCosts(self.PA,**ac)
        self.fee_inspection = self.AC.fee_inspection
        self.fee_appraisal = self.AC.fee_appraisal
        self.fee_legal = self.AC.fee_legal
        self.rate_title_insurance_aq = self.AC.rate_title_insurance_aq
        self.title_insurance_aq = self.AC.title_insurance_aq
        self.lender_costs_other = self.AC.lender_costs_other
        self.rate_transfer_tax_aq = self.AC.rate_transfer_tax_aq
        self.transfer_tax_aq = self.AC.transfer_tax_aq
        self.total_acquisition = self.AC.total_acquisition

        gross_sale_30 = self.PA.purchase_price * (1 + ((self.GA.home_appreciation+self.GA.ret_inflation+self.GA.other_inflation)/100))
        self.DC = DispositionCosts(gross_sale_30,**dc)
        self.rate_title_insurance_dis = self.DC.rate_title_insurance_dis
        self.title_insurance_dis = self.DC.title_insurance_dis
        self.rate_transfer_tax_dis = self.DC.rate_transfer_tax_dis
        self.transfer_tax_dis = self.DC.transfer_tax_dis
        self.rate_brokerage = self.DC.rate_brokerage
        self.fee_brokerage = self.DC.fee_brokerage
        self.total_disposition = self.DC.total_disposition

        self.OC = OperatingCosts(self.PA,**oc)
        self.rate_property_tax = self.OC.rate_property_tax
        self.property_tax = self.OC.property_tax
        self.rate_home_insurance = self.OC.rate_home_insurance
        self.home_insurance = self.OC.home_insurance
        self.rate_home_maintenance = self.OC.rate_home_maintenance
        self.home_maintenance = self.OC.home_maintenance
        self.rate_hoa_util = self.OC.rate_hoa_util
        self.hoa_util = self.OC.hoa_util

        self.LA = LoanAssumptions(self.PA,**la)
        self.rate_ltv_max = self.LA.rate_ltv_max
        self.loan_ltv_max = self.LA.loan_ltv_max
        self.loan_ltv_desired = self.LA.loan_ltv_desired
        self.rate_ltv_desired = self.LA.rate_ltv_desired
        self.rate_home_loan = self.LA.rate_home_loan
        self.amort_home_loan = self.LA.amort_home_loan
        self.rate_mortgage_insurance = self.LA.rate_mortgage_insurance
        self.clear_mortgage_insurance = self.LA.clear_mortgage_insurance
        self.rate_mortgage_points = self.LA.rate_mortgage_points
        self.mortgage_points = self.LA.mortgage_points

        self.months = [month for month in range(self.hold_period_m+1)]
        self.years = [int(np.ceil(month/12)) for month in range(self.hold_period_m+1)]

    def __str__(self):
        '''for key,value in vars(self).items():
            print(f"{key}: {value}")'''
        for category in [self.PA,self.RA,self.GA,self.AC,self.DC,self.OC,self.LA]:
            category.__str__()

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
        self.rent = np.zeros(query.hold_period_m+1)
        self.rent_insur = np.zeros(query.hold_period_m+1)
        self.rent_cashflow = np.zeros(query.hold_period_m+1)
        self.net_rent = np.zeros(query.hold_period_m+1) #= self.calc_cashflow(query)
        self.total_rcf = -1

        self.__mrcf__(query)
        self.dict = {"Years": query.years,
                    "Months": query.months,
                    "Monthly Rent": self.rent,
                    "Renter's Insurance": self.rent_insur,
                    "Renter's Cash Flow": self.rent_cashflow,
                    "Net Rent": self.net_rent}

    def __mrcf__(self,query):
        month = 1
        hold_period_m = query.hold_period_m
        for i in range(1, hold_period_m+1):
            year = month//12         
            if month > 0 and month<=hold_period_m:
                if month == 1:
                    self.rent[i] = self.rent[i-1] - query.monthly_rent
                    self.rent_insur[i] = self.rent_insur[i-1] - (query.renters_insurance / 12)
                    month += 1
                else:
                    if year==(month-1)/12: #asks if previous month was last year...
                        self.rent[i] = round(self.rent[i-1] * (1 + (query.rent_growth/100)), 2) #adjusts rent per annual growth
                        self.rent_insur[i] = round(self.rent_insur[i-1] * (1 + (query.rent_growth/100)), 2) #adjusts rent per annual growth
                        #self.rent[i] = self.rent[i-1] * (1 + (query.rent_growth/100)) #adjusts rent per annual growth
                        month += 1
                    else:
                        self.rent[i] = self.rent[i-1]
                        self.rent_insur[i] = self.rent_insur[i-1]
                        month += 1
            
        for i in range(query.hold_period_m+1):
            # These two lines populate flat rate renter's insurance, comment out for appreciation...
            #if i > 0:
                #mcf_rent_insur[i] = renters_insurance/12
            self.rent_cashflow[i] = self.rent[i] + self.rent_insur[i]

            if i>0:
                self.net_rent[i] = self.net_rent[i-1] + self.rent[i] + self.rent_insur[i]

        self.total_rcf = sum(self.rent_cashflow)

    def __str__(self):
        def __str__(self):
            for field,values in self.dict.items():
                if field == "Years" or field == "Months":
                    continue
                if sum(values) < 0:
                    print(f"Total {field}: -${-sum(values)}")
                else:
                    print(f"Total {field}: ${sum(values)}")
    
    def __df__(self,transpose=False):
        if transpose:
            return pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()
        
        return pd.DataFrame(data=self.dict).set_index(["Years","Months"])
    
class MonthlyUnleveredCashFlow:
    def __init__(self,query,MRCF):
        self.acquis = np.zeros(query.hold_period_m+1)
        self.acquis[0] = -query.purchase_price

        self.acquis_costs = np.zeros(query.hold_period_m+1)
        self.acquis_costs[0] = -query.total_acquisition
        self.sale = np.zeros(query.hold_period_m+1)

        self.dispo_costs = np.zeros(query.hold_period_m+1)
        self.unlv_own_cf = np.zeros(query.hold_period_m+1)
        self.unlv_net_cf = np.zeros(query.hold_period_m+1)
        self.total = np.zeros(query.hold_period_m+1)

        self.__mucf__(query,MRCF)
        self.dict = {"Years": query.years,
                    "Months": query.months,
                    "Acquisition": self.acquis,
                    "Acquisition Costs": self.acquis_costs,
                    "Sale": self.sale,
                    "Disposition Costs": self.dispo_costs,
                    "Property Tax": self.prop_tax,
                    "Property Tax Shield": self.prop_tax_shield,
                    "Insurance": self.insurance,
                    "Maintenance": self.maintenance,
                    "Condo Dues": self.hoa_dues,
                    "Unlevered Owner Cash Flow": self.unlv_own_cf,
                    "Unlevered Net Cash Flow": self.unlv_net_cf,
                    "Unlevered Total": self.total}

    def __mucf__(self,query,MRCF):
        # Computes various rent appreciations across study period...
        def mcf_own_func(month, year, hold_period_m, tax, inflation):
            own_list = np.zeros(hold_period_m+1)
            for i in range(1, hold_period_m+1):
                year = np.ceil(month/12)
                if month>0 and month<=hold_period_m:
                    own_list[i] = -(tax/12)*((1 + inflation/100)**(year-1))
                month += 1
            return own_list

        # Computes property tax shield across study period...
        def mcf_pts_func(bool_salt, salt_limit, bool_federal, rate_federal_tax, mcf_prop_tax, hold_period_m):
            pts = np.zeros(hold_period_m+1)
            for i in range(1, hold_period_m+1):
                if bool_salt:
                    pts[i] = min(-mcf_prop_tax[i], salt_limit/12)
                else:
                    pts[i] = -mcf_prop_tax[i]
                if bool_federal:
                    pts[i] = pts[i] * (rate_federal_tax/100)
            return pts
        
        self.sale[query.hold_period_m] = query.purchase_price*(1 + (query.home_appreciation/100))**query.hold_period
        self.dispo_costs[query.hold_period_m] = -(0.055 * self.sale[query.hold_period_m])

        month = 1
        year = 0
        self.prop_tax = mcf_own_func(month, year, query.hold_period_m, query.property_tax, query.ret_inflation)

        self.prop_tax_shield = mcf_pts_func(query.bool_salt, query.salt_limit, query.bool_federal, query.rate_federal_tax, self.prop_tax, query.hold_period_m)

        self.insurance = mcf_own_func(month, year, query.hold_period_m, query.home_insurance, query.other_inflation)
        self.maintenance = mcf_own_func(month, year, query.hold_period_m, query.home_maintenance, query.other_inflation)
        self.hoa_dues = mcf_own_func(month, year, query.hold_period_m, query.hoa_util*12, query.other_inflation)

        self.unlv_own_cf[0] = self.total[0] = np.sum((self.acquis[0],self.acquis_costs[0]))
        self.unlv_net_cf[0] = np.subtract(self.unlv_own_cf[0], MRCF.rent_cashflow[0])

        for i in range(1,query.hold_period_m+1):
            if i < query.hold_period_m:
                self.unlv_own_cf[i] = np.sum((self.dispo_costs[i],self.prop_tax[i],self.prop_tax_shield[i],self.insurance[i],self.maintenance[i],self.hoa_dues[i]))
                self.unlv_net_cf[i] = np.subtract(self.unlv_own_cf[i], MRCF.rent_cashflow[i])
                self.total[i] = self.total[i-1] + self.unlv_own_cf[i]
            else:
                self.unlv_own_cf[i] = np.sum((self.dispo_costs[i],self.prop_tax[i],self.prop_tax_shield[i],self.insurance[i],self.maintenance[i],self.hoa_dues[i]))
                self.unlv_own_cf[i] = np.sum([self.unlv_own_cf[i], self.sale[i]])
                self.unlv_net_cf[i] = np.subtract(self.unlv_own_cf[i], MRCF.rent_cashflow[i])
                self.total[i] = self.total[i-1] + self.unlv_own_cf[i]
        
        self.gross_sale_30y = np.sum(self.sale)
        self.total_mucf = np.sum(self.unlv_own_cf)

    def __str__(self):
        for field,values in self.dict.items():
            if field == "Years" or field == "Months":
                continue
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")
    
    def __df__(self,transpose=False):       
        if transpose:
            return pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()

        return pd.DataFrame(data=self.dict).set_index(["Years","Months"])
    
class MonthlyLeveredCashFlow:
    def __init__(self,query,MRCF,MUCF):
        self.loan_proc = np.zeros(query.hold_period_m+1)
        self.loan_repay = np.zeros(query.hold_period_m+1)
        self.loan_points = np.zeros(query.hold_period_m+1)
        self.amort = np.zeros(query.hold_period_m+1)
        self.interest = np.zeros(query.hold_period_m+1)
        self.interest_tax_shield = np.zeros(query.hold_period_m+1)
        self.mortgage_insurance = np.zeros(query.hold_period_m+1)
        self.lv_own_cf = np.zeros(query.hold_period_m+1)
        self.lv_net_cf = np.zeros(query.hold_period_m+1)
        self.gross_equity = np.zeros(query.hold_period_m+1)
        self.net_equity = np.zeros(query.hold_period_m+1)
        self.__mlcf__(query,MRCF,MUCF)
        self.dict = {"Years": query.years,
                    "Months": query.months,
                    "Loan Proceeds": self.loan_proc,
                    "Loan Repayment": self.loan_repay,
                    "Amortization": self.amort,
                    "Loan Points": self.loan_points,
                    "Interest": self.interest,
                    "Interest Tax Shield": self.interest_tax_shield,
                    "Mortgage Insurance": self.mortgage_insurance,
                    "Levered Owner Cash Flow": self.lv_own_cf,
                    "Levered Net Cash Flow": self.lv_net_cf,
                    "Cum. Gross Equity": self.gross_equity,
                    "Cum. Net Equity": self.net_equity}
    
    def __mlcf__(self,query,MRCF,MUCF):
        def pmt_func(rate, nper, pv):
            return pv * (rate) / (1 - (1 + rate)**(-nper))
        
        self.loan_proc[0] = query.loan_ltv_desired
        self.loan_points[0] = -query.mortgage_points
    
        month = 0
        for i in range(query.hold_period_m+1):
            if month > 0 and month <= query.hold_period_m:
                self.interest[i] = -np.round(np.sum([self.loan_proc[:i], self.loan_repay[:i], self.amort[:i]]),2) * (query.rate_home_loan/100/12)
                self.amort[i] = -pmt_func(query.rate_home_loan/100, query.amort_home_loan, query.purchase_price*query.rate_ltv_desired/100)/12 - self.interest[i]
                self.interest_tax_shield[i] = -self.interest[i] * query.rate_federal_tax/100
                self.mortgage_insurance[i] = -((query.rate_mortgage_insurance/100)/12) * np.max(query.purchase_price*(query.rate_ltv_desired/100 - query.clear_mortgage_insurance/100),0) * \
                                            ((np.sum([self.loan_proc[:i], self.loan_repay[:i], self.amort[:i]]) - query.purchase_price*query.clear_mortgage_insurance/100) > 0)
                if month == query.hold_period_m:
                    self.loan_repay[-1] = -(np.sum(self.amort) + self.loan_proc[0])

            self.lv_own_cf[i] = np.sum([MUCF.unlv_own_cf[i],self.loan_proc[i],self.loan_repay[i],self.amort[i],self.loan_points[i],self.interest[i],self.interest_tax_shield[i],self.mortgage_insurance[i]])
            self.lv_net_cf[i] = self.lv_own_cf[i] - MRCF.rent_cashflow[i]

            if month == 0:
                self.gross_equity[i] = self.lv_own_cf[i]
                self.net_equity[i] = self.lv_net_cf[i]
            else:
                self.gross_equity[i] = self.gross_equity[i-1] + self.lv_own_cf[i]
                self.net_equity[i] = self.net_equity[i-1] + self.lv_net_cf[i]

            month +=1

    def __str__(self):
        for field,values in self.dict.items():
            if field == "Years" or field == "Months":
                continue
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")
            
        '''print("Total Levered Net Cash Flow: ${}", sum(self.lv_net_cf)) # does this make sense??'''

    
    def __df__(self,transpose=False):        
        if transpose:
            table = pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()
        else:
            table = pd.DataFrame(data=self.dict).set_index(["Years","Months"])

        return table
    
class AnnualRentCashFlow:
    def __init__(self,query,MRCF):
        self.years = [year for year in range(query.hold_period+1)]
        self.months = [year*12 for year in self.years]

        self.rent  = np.zeros(query.hold_period+1)
        self.rent_insur = np.zeros(query.hold_period+1)
        self.rent_cashflow = np.zeros(query.hold_period+1)
        self.__arcf__(query,MRCF)
        self.dict = {"Years": self.years,
                    "Months": self.months,
                    "Monthly Rent": self.rent,
                    "Renter's Insurance": self.rent_insur,
                    "Renter's Cash Flow": self.rent_cashflow}

    def __arcf__(self, query, MRCF):
        months = query.months
        hold_period = query.hold_period
        hold_period_m = query.hold_period_m

        self.years = months[:hold_period+1]
        self.months = np.zeros(hold_period+1)
        for i in range(1, hold_period+1):
            self.months[i] = self.years[i]*12

        m = 1
        for i in range(12,hold_period_m+1,12):
            self.rent[m] = np.sum(MRCF.rent[i-11:i+1])
            self.rent_insur[m] = np.sum(MRCF.rent_insur[i-11:i+1])
            self.rent_cashflow[m] = np.sum([self.rent[m], self.rent_insur[m]])
            m += 1

    def __str__(self):
        for field,values in self.dict.items():
            if field == "Years" or field == "Months":
                continue
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")

    def __df__(self, transpose=False):
        if transpose:
            return pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()
        
        return pd.DataFrame(data=self.dict).set_index(["Years","Months"])
    
class AnnualUnleveredCashFlow:
    def __init__(self, query, MUCF, ARCF):
        hold_period = query.hold_period

        self.years = [year for year in range(hold_period+1)]
        self.months = [year*12 for year in self.years]

        self.acquis = np.zeros(hold_period+1)
        self.acquis_costs = np.zeros(hold_period+1)
        self.sale = np.zeros(hold_period+1)
        self.dispo_costs = np.zeros(hold_period+1)
        self.prop_tax = np.zeros(hold_period+1)
        self.prop_tax_shield = np.zeros(hold_period+1)
        self.insurance = np.zeros(hold_period+1)
        self.maintenance = np.zeros(hold_period+1)
        self.hoa_dues = np.zeros(hold_period+1)
        self.unlv_own_cf = np.zeros(hold_period+1)
        self.unlv_net_cf = np.zeros(hold_period+1)
        self.__aucf__(query, MUCF, ARCF)
        self.dict = {"Years": self.years,
                    "Months": self.months,
                    "Acquisition": self.acquis,
                    "Acquisition Costs": self.acquis_costs,
                    "Sale": self.sale,
                    "Disposition Costs": self.dispo_costs,
                    "Property Tax": self.prop_tax,
                    "Property Tax Shield": self.prop_tax_shield,
                    "Insurance": self.insurance,
                    "Maintenance": self.maintenance,
                    "Condo Dues": self.hoa_dues,
                    "Unlevered Owner Cash Flow": self.unlv_own_cf,
                    "Unlevered Net Cash Flow": self.unlv_net_cf}

    def __aucf__(self,query,MUCF,ARCF):
        self.acquis[0] = np.sum(MUCF.acquis[0])
        self.acquis_costs[0] = np.sum(MUCF.acquis_costs[0])
        self.sale[-1] = np.sum(MUCF.sale[-1])
        self.dispo_costs[-1] = np.sum(MUCF.dispo_costs[-1])

        m = 1
        hold_period_m = query.hold_period_m
        for i in range(12,hold_period_m+1,12):
            self.prop_tax[m] = np.sum(MUCF.prop_tax[i-11:i+1])
            self.prop_tax_shield[m] = np.sum(MUCF.prop_tax_shield[i-11:i+1])
            self.insurance[m] = np.sum(MUCF.insurance[i-11:i+1])
            self.maintenance[m] = np.sum(MUCF.maintenance[i-11:i+1])
            self.hoa_dues[m] = np.sum(MUCF.hoa_dues[i-11:i+1])
            m += 1
        
        hold_period = query.hold_period
        for i in range(hold_period+1):
            if i == 0:
                self.unlv_own_cf[i] = np.sum((self.acquis[i], self.acquis_costs[i]))
                self.unlv_net_cf[i] = np.subtract(self.unlv_own_cf[i], ARCF.rent_cashflow[i])
            elif i < hold_period:
                self.unlv_own_cf[i] = np.sum((self.dispo_costs[i], self.prop_tax[i], self.prop_tax_shield[i], self.insurance[i], self.maintenance[i], self.hoa_dues[i]))
                self.unlv_net_cf[i] = np.subtract(self.unlv_own_cf[i], ARCF.rent_cashflow[i])
            else:
                self.unlv_own_cf[i] = np.sum((self.dispo_costs[i], self.prop_tax[i], self.prop_tax_shield[i], self.insurance[i], self.maintenance[i], self.hoa_dues[i]))
                self.unlv_own_cf[i] = np.sum([self.unlv_own_cf[i], self.sale[i]])
                self.unlv_net_cf[i] = np.subtract(self.unlv_own_cf[i], ARCF.rent_cashflow[i])

    def __str__(self):
        for field,values in self.dict.items():
            if field == "Years" or field == "Months":
                continue
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")
    
    def __df__(self, transpose=False):        
        if transpose:
            return pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()

        return pd.DataFrame(data=self.dict).set_index(["Years","Months"])
    
class AnnualLeveredCashFlow:
    def __init__(self, query, MLCF, ARCF, AUCF):
        hold_period = query.hold_period

        self.years = [year for year in range(hold_period+1)]
        self.months = [year*12 for year in self.years]

        self.loan_proc = np.zeros(hold_period+1)
        self.loan_repay = np.zeros(hold_period+1)
        self.loan_points = np.zeros(hold_period+1)

        self.loan_proc[0] = query.loan_ltv_desired
        self.loan_repay[-1] = np.sum(MLCF.loan_repay[-1])
        self.loan_points[0] = -query.mortgage_points

        self.amort = np.zeros(hold_period+1)
        self.interest = np.zeros(hold_period+1)
        self.interest_tax_shield = np.zeros(hold_period+1)
        self.mortgage_insurance = np.zeros(hold_period+1)

        self.lv_own_cf = np.zeros(hold_period+1)
        self.lv_net_cf = np.zeros(hold_period+1)
        self.lv_ge = np.zeros(hold_period+1)
        self.lv_ne = np.zeros(hold_period+1)

        self.__alcf__(query,MLCF,ARCF,AUCF)
        self.dict = {"Years": self.years,
                    "Months": self.months,
                    "Loan Proceeds": self.loan_proc,
                    "Loan Repayment": self.loan_repay,
                    "Amortization": self.amort,
                    "Loan Points": self.loan_points,
                    "Interest": self.interest,
                    "Interest Tax Shield": self.interest_tax_shield,
                    "Mortgage Insurance": self.mortgage_insurance,
                    "Levered Owner Cash Flow": self.lv_own_cf,
                    "Levered Net Cash Flow": self.lv_net_cf,
                    "Cum. Gross Equity": self.lv_ge,
                    "Cum. Net Equity": self.lv_ne}

    def __alcf__(self,query,MLCF,ARCF,AUCF):
        hold_period = query.hold_period
        hold_period_m = query.hold_period_m

        acf_year=1
        for i in range(12,hold_period_m+1,12):
            if acf_year > 0 and acf_year <= hold_period:
                self.amort[acf_year] = np.sum(MLCF.amort[i-11:i+1])
                self.interest[acf_year] = np.sum(MLCF.interest[i-11:i+1])
                self.interest_tax_shield[acf_year] = np.sum(MLCF.interest_tax_shield[i-11:i+1])
                self.mortgage_insurance[acf_year] = np.sum(MLCF.mortgage_insurance[i-11:i+1])
            acf_year += 1

        for i in range(hold_period+1):
            if i == 0:
                self.lv_own_cf[i] = np.sum([AUCF.unlv_own_cf[i], self.loan_proc[i], self.loan_points[i]])
                self.lv_net_cf[i] = np.subtract(self.lv_own_cf[i], ARCF.rent_cashflow[i])
                self.lv_ge[i] = self.lv_own_cf[i]
                self.lv_ne[i] = self.lv_net_cf[i]
            elif i < hold_period:
                self.lv_own_cf[i] = np.sum([AUCF.unlv_own_cf[i], self.loan_proc[i], self.loan_repay[i], self.amort[i], self.loan_points[i], self.interest[i], self.interest_tax_shield[i], self.mortgage_insurance[i]])
                self.lv_net_cf[i] = np.subtract(self.lv_own_cf[i], ARCF.rent_cashflow[i])
                self.lv_ge[i] = self.lv_ge[i-1] + self.lv_own_cf[i]
                self.lv_ne[i] = self.lv_ne[i-1] + self.lv_net_cf[i]
            else:
                self.lv_own_cf[i] = np.sum([AUCF.unlv_own_cf[i], self.loan_proc[i], self.loan_repay[i], self.amort[i], self.loan_points[i], self.interest[i], self.interest_tax_shield[i], self.mortgage_insurance[i]])
                self.lv_net_cf[i] = np.subtract(self.lv_own_cf[i], ARCF.rent_cashflow[i])
                self.lv_ge[i] = self.lv_ge[i-1] + self.lv_own_cf[i]
                self.lv_ne[i] = self.lv_ne[i-1] + self.lv_net_cf[i]

    def __str__(self):
        for field,values in self.dict.items():
            if field == "Years" or field == "Months":
                continue
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")

    def __df__(self,transpose=False):
        if transpose:
            return pd.DataFrame(data=self.dict).set_index(["Years","Months"]).transpose()
        
        return pd.DataFrame(data=self.dict).set_index(["Years","Months"])
    
class CashFlow:
    def __init__(self,query):
        self.query = query
        self.MRCF = MonthlyRentCashFlow(query)
        self.MUCF = MonthlyUnleveredCashFlow(query, self.MRCF)
        self.MLCF = MonthlyLeveredCashFlow(query, self.MRCF, self.MUCF)

        self.ARCF = AnnualRentCashFlow(query, self.MRCF)
        self.AUCF = AnnualUnleveredCashFlow(query, self.MUCF, self.ARCF)
        self.ALCF = AnnualLeveredCashFlow(query, self.MLCF, self.ARCF, self.AUCF)

        self.mcf_dict = {
            "Years": query.years,
            "Months": query.months,
            "Rent": self.MRCF.rent,
            "Renter's Insurance": self.MRCF.rent_insur,
            "Renter's Cash Flow": self.MRCF.rent_cashflow,
            "Acquisition": self.MUCF.acquis,
            "Acquisition Costs": self.MUCF.acquis_costs,
            "Sale": self.MUCF.sale,
            "Disposition Costs": self.MUCF.dispo_costs,
            "Property Tax": self.MUCF.prop_tax,
            "Property Tax Shield": self.MUCF.prop_tax_shield,
            "Insurance": self.MUCF.insurance,
            "Maintenance": self.MUCF.maintenance,
            "Condo Dues": self.MUCF.hoa_dues,
            "Unlevered Owner Cash Flow": self.MUCF.unlv_own_cf,
            "Unlevered Net Cash Flow": self.MUCF.unlv_net_cf,
            "Loan Proceeds": self.MLCF.loan_proc,
            "Loan Repayment": self.MLCF.loan_repay,
            "Amortization": self.MLCF.amort,
            "Loan Points": self.MLCF.loan_points,
            "Interest": self.MLCF.interest,
            "Interest Tax Shield": self.MLCF.interest_tax_shield,
            "Mortgage Insurance": self.MLCF.mortgage_insurance,
            "Levered Owner Cash Flow": self.MLCF.lv_own_cf,
            "Levered Net Cash Flow": self.MLCF.lv_net_cf,
            "Cum. Gross Equity": self.MLCF.gross_equity,
            "Cum. Net Equity": self.MLCF.net_equity}
        
        self.acf_dict = {
            "Years": [year for year in range(query.hold_period+1)],
            "Months": [year*12 for year in range(query.hold_period+1)],
            "Rent": self.ARCF.rent,
            "Renter's Insurance": self.ARCF.rent_insur,
            "Renter's Cash Flow": self.ARCF.rent_cashflow,
            "Acquisition": self.AUCF.acquis,
            "Acquisition Costs": self.AUCF.acquis_costs,
            "Sale": self.AUCF.sale,
            "Disposition Costs": self.AUCF.dispo_costs,
            "Property Tax": self.AUCF.prop_tax,
            "Property Tax Shield": self.AUCF.prop_tax_shield,
            "Insurance": self.AUCF.insurance,
            "Maintenance": self.AUCF.maintenance,
            "Condo Dues": self.AUCF.hoa_dues,
            "Unlevered Owner Cash Flow": self.AUCF.unlv_own_cf,
            "Unlevered Net Cash Flow": self.AUCF.unlv_net_cf,
            "Loan Proceeds": self.ALCF.loan_proc,
            "Loan Repayment": self.ALCF.loan_repay,
            "Amortization": self.ALCF.amort,
            "Loan Points": self.ALCF.loan_points,
            "Interest": self.ALCF.interest,
            "Interest Tax Shield": self.ALCF.interest_tax_shield,
            "Mortgage Insurance": self.ALCF.mortgage_insurance,
            "Levered Owner Cash Flow": self.ALCF.lv_own_cf,
            "Levered Net Cash Flow": self.ALCF.lv_net_cf,
            "Cum. Gross Equity": self.ALCF.lv_ge,
            "Cum. Net Equity": self.ALCF.lv_ne}
        
    def __str__(self, cf):
        for field,values in self.mcf_dict.items() if cf == "mcf" else self.acf_dict.items():
            if field == "Years" or field == "Months":
                continue

            if field == "Rent":
                print("\nRent Scenario:")
            elif field == "Acquisition":
                print("\nOwn Scenario:")
            elif field == "Loan Proceeds":
                print("\nLoan Cash Flow:")
            
            if sum(values) < 0:
                print(f"Total {field}: -${-sum(values)}")
            else:
                print(f"Total {field}: ${sum(values)}")

    def __df__(self, cf, transpose=False):  
        if transpose:
            return pd.DataFrame(data=self.mcf_dict if cf == "mcf" else self.acf_dict).set_index(["Years","Months"]).transpose()
        
        return pd.DataFrame(data=self.mcf_dict if cf == "mcf" else self.acf_dict).set_index(["Years","Months"])
    
'''
initialization logic...
'''

def initialize(json):
    pa = {
        "purchase_price": json["price"],
        "hold_period": json["holding_y"]
    }

    #PA = PurchaseAssumptions(json["price"],json["holding_y"])

    ra = {
        "apartment_rent": json["rent_m"],
        "parking_rent": json["parking_m"],
        "renters_insurance": json["rent_insur_m"]
    }

    #RA = RentAssumptions(**ra)

    ga = {
        "rate_capital_gains": json["cap_gains_rate"],
        "rate_federal_tax": json["federal_tax_rate"],
        "bool_federal": json["federal_tax_bool"],
        "salt_limit": json["salt_limit"],
        "bool_salt": json["salt_limit_bool"],
        "rent_growth": json["rent_growth"],
        "home_appreciation": json["home_price_appr"],
        "ret_inflation": json["ret_inflation"],
        "other_inflation": json["other_inflation"]
    }

    #GA = GeneralAssumptions(**ga)

    ac = {
        "fee_inspection": json["inspection"],
        "fee_appraisal": json["appraisal"],
        "fee_legal": json["legal_fees"],
        "rate_title_insurance_aq": json["title_insur_acq_rate"],
        "lender_costs_other": json["other_lender_costs"],
        "rate_transfer_tax_aq": json["transfer_tax_acq_rate"]
    }

    #AC = AcquisitionCosts(**ac)

    dc = {
        "rate_title_insurance_dis": json["title_insur_disp"],
        "rate_transfer_tax_dis": json["transfer_tax_acq_rate"],
        "rate_brokerage": json["broker_rate"]
    }

    #DC = DispositionCosts(**dc)
    #DC.__str__()

    oc = {
        "rate_property_tax": json["property_tax_rate"],
        "rate_home_insurance": json["home_insurance_rate"],
        "rate_home_maintenance": json["maintenance_rate"],
        "rate_hoa_util": json["hoa_util_rate"]
    }

    #OC = OperatingCosts(**oc)

    la = {
        "rate_ltv_max": json["max_loan_rate"],
        "loan_ltv_max": json["desired_loan_rate"],
        "rate_home_loan": json["loan_rate"],
        "amort_home_loan": json["loan_amortization"],
        "rate_mortgage_insurance": json["mortgage_insur_rate"],
        "clear_mortgage_insurance": json["mortgage_insur_limit"],
        "rate_mortgage_points": json["mortgage_points_rate"]
    }

    #LA = LoanAssumptions(**la)

    query = Query(pa,ra,ga,ac,dc,oc,la)

    return query

def main(query_input):
    # Convert the JSON string back to a dictionary
    input_json = json.loads(query_input)

    query = initialize(input_json)

    CF = CashFlow(query)

    mcf_results = {}
    acf_results = {}

    for key, value in CF.mcf_dict.items():
        # check if value is ndarry and convert if so...
        mcf_results[key] = value.tolist() if isinstance(value, np.ndarray) else value

    for key, value in CF.acf_dict.items():
        # check if value is ndarry and convert if so...
        acf_results[key] = value.tolist() if isinstance(value, np.ndarray) else value

    results = {"mcf": mcf_results, 
               "acf": acf_results}
    
    print(json.dumps(results))

    #return json.dumps(results)
    return CF

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process query parameters.")
    parser.add_argument("--query", type=str, required=True, help="JSON string representing the query parameter.")

    args = parser.parse_args()

    main(args.query)