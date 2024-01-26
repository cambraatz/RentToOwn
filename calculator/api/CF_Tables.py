import sqlite3
from sqlite3 import Error

import numpy as np
#from scipy import optimize
#import numpy_financial as npf
import pandas as pd
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
'''
#datafield.user_id = user_id
purchase_price = 500000
hold_period = 5
hold_period_m = 60
apartment_rent = 3000
parking_rent = 300
renters_insurance = 600
monthly_rent = 3300

rate_capital_gains = 20
rate_federal_tax = 35
bool_federal = True
salt_limit = 10000
bool_salt = True
rent_growth = 3
home_appreciation = 3
ret_inflation = 3
other_inflation = 3

fee_inspection = 1000
fee_appraisal = 750
fee_legal = 1500
rate_title_insurance_aq = 0.5
title_insurance_aq = 2500
lender_costs_other = 2000
rate_transfer_tax_aq = 0
transfer_tax_aq = 0
total_acquisition = 7750

rate_title_insurance_dis = 0
title_insurance_dis = 0
rate_transfer_tax_dis = 0
transfer_tax_dis = 0
rate_brokerage = 5.5
fee_brokerage = 31880
total_disposition = 31880

rate_property_tax = 0.6
property_tax = 3000
rate_home_insurance = 0.6
home_insurance = 3000
rate_home_maintenance = 1
home_maintenance = 5000
rate_hoa_util = 0.25
hoa_util = 104

rate_ltv_max = 80
loan_ltv_max = 787750
loan_ltv_desired = 400000
rate_ltv_desired = 80
rate_home_loan = 7
amort_home_loan = 30
rate_mortgage_insurance = 5
clear_mortgage_insurance = 80
rate_mortgage_points = 1
mortgage_points = 4000
'''

# --------------------------------------------------------------------------------------------------------------- # 
'''
Monthly Cash Flow Calculations

The section immediately following holds MCF Rent Helpers for calculating anticipated interest rates. The next
section holds the master rent function that generates the raw HTML table and the total rent cash flow value.

'''
# --------------------------------------------------------------------------------------------------------------- # 
# mcf_rent_func() computes monthly rent appreciation across extent of study period...
def mcf_rent_func(month, year, hold_period_m, monthly_rent, rent_growth, duration):
    rent = np.zeros(duration+1)
    
    for i in range(1, duration+1):
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

# Computes various rent appreciations across study period...
def mcf_own_func(month, year, hold_period_m, tax, inflation, duration):
    own_list = np.zeros(duration+1)
    for i in range(1, duration+1):
        year = np.ceil(month/12)
        if month>0 and month<=hold_period_m:
            own_list[i] = -(tax/12)*((1 + inflation/100)**(year-1))
        month += 1
    return own_list

# Computes property tax shield across study period...
def mcf_pts_func(bool_salt, salt_limit, bool_federal, rate_federal_tax, mcf_prop_tax, duration):
    pts = np.zeros(duration+1)
    for i in range(1, duration+1):
        if bool_salt:
            pts[i] = min(-mcf_prop_tax[i], salt_limit/12)
        else:
            pts[i] = -mcf_prop_tax[i]
        if bool_federal:
            pts[i] = pts[i] * (rate_federal_tax/100)
    return pts

# Helper-function to populate the following set of entries...
def input_gen(func,arg1,arg2,arg3,arg4,arg5,arg6):
    if arg6 == 0:
        own_list = func(arg1,arg2,arg3,arg4,arg5)
    else:
        own_list = func(arg1,arg2,arg3,arg4,arg5,arg6)
    #own_list =  list(np.around(np.array(own_list),0))
    return own_list

# Helper function for calculating monthly loan payments...
def pmt_func(rate, nper, pv):
    #rate = rate/100
    return pv * (rate) / (1 - (1 + rate)**(-nper))

# --------------------------------------------------------------------------------------------------------------- # 
# gen_mcf_table() computes monthly cash flow and returns raw HTML table and total cash flow values...

def gen_mcf_table(purchase_price, hold_period, hold_period_m, monthly_rent, rent_growth, renters_insurance, 
                    bool_federal, rate_federal_tax, bool_salt, salt_limit, total_acquisition, home_appreciation, 
                    ret_inflation, other_inflation, total_disposition, property_tax, home_insurance, 
                    home_maintenance, hoa_util, loan_ltv_desired, rate_ltv_desired, rate_home_loan, amort_home_loan, 
                    rate_mortgage_insurance, clear_mortgage_insurance, mortgage_points):
    # initialize the header lists for input later, standard incremental months/years...
    months = list(range(hold_period_m+1))
    years = np.zeros(hold_period_m+1)
    #acf_months = np.zeros((hold_period_m+1)//12)

    for i in range(len(months)):
        years[i] = np.ceil(months[i]/12)

    # initialize the arguments to their starting values...
    mcf_month = 1
    mcf_year = 0

    mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m)
    mcf_rent_insur = mcf_rent_func(mcf_month, mcf_year, hold_period_m, (renters_insurance/12), rent_growth, hold_period_m)
    mcf_rent_cashflow = np.zeros(hold_period_m+1)
    for i in range(hold_period_m+1):
        # These two lines populate flat rate renter's insurance, comment out for appreciation...
        #if i > 0:
            #mcf_rent_insur[i] = renters_insurance/12
        mcf_rent_cashflow[i] = mcf_rent[i] + mcf_rent_insur[i]

    total_rcf = np.sum(mcf_rent_cashflow)
    #print("Total Renter Cash Flow: ${}".format(total_rcf))

    # initialize the header lists for input later, standard incremental months/years...
    months = list(range(hold_period_m+1))
    years = np.zeros(hold_period_m+1)

    for i in range(len(months)):
        years[i] = np.ceil(months[i]/12)


    # --------------------------------------------------------------------------------------------------------------- #
    # initialize the arguments to their starting values...
    mcf_month = 1
    mcf_year = 0

    # Populate all owner's fields across study period...
    mcf_acquis = np.zeros(hold_period_m+1)
    mcf_acquis_costs = np.zeros(hold_period_m+1)
    mcf_sale = np.zeros(hold_period_m+1)
    mcf_dispo_costs = np.zeros(hold_period_m+1)
    mcf_unlv_own_cf = np.zeros(hold_period_m+1)
    mcf_unlv_net_cf = np.zeros(hold_period_m+1)

    mcf_acquis[0] = -purchase_price
    mcf_acquis_costs[0] = -total_acquisition

    #mcf_sale[hold_period_m] = np.round(purchase_price*(1 + (home_appreciation/100))**hold_period, 0)
    #mcf_dispo_costs[hold_period_m] = -np.round(total_disposition)
    mcf_sale[hold_period_m] = purchase_price*(1 + (home_appreciation/100))**hold_period
    mcf_dispo_costs[hold_period_m] = -total_disposition

    mcf_prop_tax = input_gen(mcf_own_func, mcf_month, mcf_year, hold_period_m, property_tax, ret_inflation, hold_period_m)
    mcf_prop_tax_shield = input_gen(mcf_pts_func,bool_salt, salt_limit, bool_federal, rate_federal_tax, mcf_prop_tax, hold_period_m)
    mcf_insurance = input_gen(mcf_own_func, mcf_month, mcf_year, hold_period_m, home_insurance, other_inflation, hold_period_m)
    mcf_maintenance = input_gen(mcf_own_func, mcf_month, mcf_year, hold_period_m, home_maintenance, other_inflation, hold_period_m)
    mcf_hoa_dues = input_gen(mcf_own_func, mcf_month, mcf_year, hold_period_m, hoa_util*12, other_inflation, hold_period_m)

    for i in range(hold_period_m+1):
        if i == 0:
            mcf_unlv_own_cf[i] = np.sum((mcf_acquis[i],mcf_acquis_costs[i]))
            mcf_unlv_net_cf[i] = np.subtract(mcf_unlv_own_cf[i],mcf_rent_cashflow[i])
        elif i < hold_period_m:
            mcf_unlv_own_cf[i] = np.sum((mcf_dispo_costs[i],mcf_prop_tax[i],mcf_prop_tax_shield[i],mcf_insurance[i],mcf_maintenance[i],mcf_hoa_dues[i]))
            mcf_unlv_net_cf[i] = np.subtract(mcf_unlv_own_cf[i],mcf_rent_cashflow[i])
        else:
            mcf_unlv_own_cf[i] = np.sum((mcf_dispo_costs[i],mcf_prop_tax[i],mcf_prop_tax_shield[i],mcf_insurance[i],mcf_maintenance[i],mcf_hoa_dues[i]))
            mcf_unlv_own_cf[i] = np.sum([mcf_unlv_own_cf[i], mcf_sale[i]])
            mcf_unlv_net_cf[i] = np.subtract(mcf_unlv_own_cf[i],mcf_rent_cashflow[i])

    gross_sale_30y = np.sum(mcf_sale)
    #print("Gross Sale Price: ${}".format(gross_sale_30y))

    # Initializes arrays and populates them...
    mcfl_loan_proc = np.zeros(hold_period_m+1)
    mcfl_loan_repay = np.zeros(hold_period_m+1)
    mcfl_loan_points = np.zeros(hold_period_m+1)
    mcfl_amort = np.zeros(hold_period_m+1)
    mcfl_interest = np.zeros(hold_period_m+1)
    mcfl_interest_tax_shield = np.zeros(hold_period_m+1)
    mcfl_mortgage_insurance = np.zeros(hold_period_m+1)
    mcfl_lv_own_cf = np.zeros(hold_period_m+1)
    mcfl_lv_net_cf = np.zeros(hold_period_m+1)
    mcfl_lv_ge = np.zeros(hold_period_m+1)
    mcfl_lv_ne = np.zeros(hold_period_m+1)

    mcfl_loan_proc[0] = loan_ltv_desired
    mcfl_loan_points[0] = -mortgage_points

    mcf_month=0

    # pull out any rate adjustment operations, need to gain back some efficiency here...
    for i in range(hold_period_m+1):
        if mcf_month > 0 and mcf_month <= hold_period_m:
            mcfl_interest[i] = -np.round(np.sum([mcfl_loan_proc[:i], mcfl_loan_repay[:i], mcfl_amort[:i]]),2) * (rate_home_loan/100/12)
            mcfl_amort[i] = -pmt_func(rate_home_loan/100, amort_home_loan, purchase_price*rate_ltv_desired/100)/12 - mcfl_interest[i]
            mcfl_interest_tax_shield[i] = -mcfl_interest[i] * rate_federal_tax/100
            mcfl_mortgage_insurance[i] = -((rate_mortgage_insurance/100)/12) * np.max(purchase_price*(rate_ltv_desired/100 - clear_mortgage_insurance/100),0) * \
                                        ((np.sum([mcfl_loan_proc[:i], mcfl_loan_repay[:i], mcfl_amort[:i]]) - purchase_price*clear_mortgage_insurance/100) > 0)
            #mcfl_lv_ge[i] = mcfl_lv_ge[i-1] + mcfl_lv_own_cf[i]
            if mcf_month == hold_period_m:
                mcfl_loan_repay[-1] = -(np.sum(mcfl_amort) + mcfl_loan_proc[0])
        mcfl_lv_own_cf[i] = np.sum([mcf_unlv_own_cf[i], mcfl_loan_proc[i], mcfl_loan_repay[i], mcfl_amort[i], mcfl_loan_points[i], mcfl_interest[i], mcfl_interest_tax_shield[i], mcfl_mortgage_insurance[i]])
        mcfl_lv_net_cf[i] = mcfl_lv_own_cf[i] - mcf_rent_cashflow[i]
        if mcf_month == 0:
            mcfl_lv_ge[i] = mcfl_lv_own_cf[i]
            mcfl_lv_ne[i] = mcfl_lv_net_cf[i]
        else:
            mcfl_lv_ge[i] = mcfl_lv_ge[i-1] + mcfl_lv_own_cf[i]
            mcfl_lv_ne[i] = mcfl_lv_ne[i-1] + mcfl_lv_net_cf[i]
        mcf_month +=1

    mcfl_loan_repay[-1] = -(np.sum(mcfl_amort) + mcfl_loan_proc[0])

    # --------------------------------------------------------------------------------------------------------------- # 
    # Table Generation: Pandas Dataframe -> Raw HTML...

    mcf_rent_dict = {"Years": years,
                    "Months": months,
                    "Monthly Rent": mcf_rent,
                    "Renter's Insurance": mcf_rent_insur,
                    "Renter's Cash Flow": mcf_rent_cashflow}

    mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"]).transpose()
    #mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])
    #mcf_rent_table

    # Sum unlevered owner's cash flow, NOTE: sum rounding error accounts for ~$4 below original model...
    total_uocf = np.sum(mcf_unlv_own_cf)
    #print("Total Unlevered Owner Cash Flow: ${}".format(total_uocf))
    total_locf = np.sum(mcfl_lv_own_cf)
    #print("Total Levered Owner Cash Flow: ${}".format(total_locf))

    mcf_own_dict = {"Years": years,
                    "Months": months,
                    "Acquisition": mcf_acquis,
                    "Acquisition Costs": mcf_acquis_costs,
                    "Sale": mcf_sale,
                    "Disposition Costs": mcf_dispo_costs,
                    "Property Tax": mcf_prop_tax,
                    "Property Tax Shield": mcf_prop_tax_shield,
                    "Insurance": mcf_insurance,
                    "Maintenance": mcf_maintenance,
                    "Condo Dues": mcf_hoa_dues,
                    "Unlevered Owner Cash Flow": mcf_unlv_own_cf,
                    "Unlevered Net Cash Flow": mcf_unlv_net_cf}

    mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"]).transpose()
    #mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"])
    #mcf_own_table

    mcfl_own_dict = {"Years": years,
                    "Months": months,
                    "Loan Proceeds": mcfl_loan_proc,
                    "Loan Repayment": mcfl_loan_repay,
                    "Amortization": mcfl_amort,
                    "Loan Points": mcfl_loan_points,
                    "Interest": mcfl_interest,
                    "Interest Tax Shield": mcfl_interest_tax_shield,
                    "Mortgage Insurance": mcfl_mortgage_insurance,
                    "Levered Owner Cash Flow": mcfl_lv_own_cf,
                    "Levered Net Cash Flow": mcfl_lv_net_cf,
                    "Cum. Gross Equity": mcfl_lv_ge,
                    "Cum. Net Equity": mcfl_lv_ne}

    mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"]).transpose()
    #mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"])
    #mcfl_own_table

    mcfr_html = mcf_rent_table.to_html(border=0)
    mcfo_html = mcf_own_table.to_html(border=0)
    mcfl_html = mcfl_own_table.to_html(border=0)

    return [mcfr_html, total_rcf, mcfo_html, gross_sale_30y, total_uocf, mcfl_html, total_locf]