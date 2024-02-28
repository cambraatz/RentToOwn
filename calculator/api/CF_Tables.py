import sqlite3
from sqlite3 import Error

import numpy as np
import scipy.optimize
#import numpy_financial as npf
import pandas as pd
from datetime import datetime, timedelta, date
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

    mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m).round(2)
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

    mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])
    #mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"]).transpose()
    #mcf_rent_table["Monthly Rent", "Renter's Insurance", "Renter's Cash Flow"].round(2)
    #mcf_rent_table.round(2)
    #mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])
    #mcf_rent_table

    # Sum unlevered owner's cash flow, NOTE: sum rounding error accounts for ~$4 below original model...
    total_uocf = np.sum(mcf_unlv_own_cf)
    #print("Total Unlevered Owner Cash Flow: ${}".format(total_uocf))
    total_locf = np.sum(mcfl_lv_own_cf)
    #print("Total Levered Owner Cash Flow: ${}".format(total_locf))
    '''
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
    '''
    mcf_own_dict = {"Acquisition": mcf_acquis,
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
    
    mcf_own_table = pd.DataFrame(data=mcf_own_dict)
    #mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"]).transpose()
    #mcf_own_table = pd.DataFrame(data=mcf_own_dict).set_index(["Years","Months"])
    #mcf_own_table
    '''
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
    '''
    mcfl_own_dict = {"Loan Proceeds": mcfl_loan_proc,
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
    mcfl_own_table = pd.DataFrame(data=mcfl_own_dict)
    #mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"]).transpose()
    #mcfl_own_table = pd.DataFrame(data=mcfl_own_dict).set_index(["Years","Months"])
    #mcfl_own_table

    mcfr_html = mcf_rent_table.to_html(border=0)
    mcfo_html = mcf_own_table.to_html(border=0)
    mcfl_html = mcfl_own_table.to_html(border=0)
    mcf_html = mcfr_html + mcfo_html + mcfo_html

    return [mcfr_html, total_rcf, mcfo_html, gross_sale_30y, total_uocf, mcfl_html, total_locf, mcf_html]

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

def gen_mcf(purchase_price, hold_period, hold_period_m, monthly_rent, rent_growth, renters_insurance, 
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

    mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m).round(2)
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
    #months = list(range(hold_period_m+1))
    #years = np.zeros(hold_period_m+1)

    #for i in range(len(months)):
        #years[i] = np.ceil(months[i]/12)


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

    mcfl_total_interest = np.sum([mcfl_interest[1:13]])
    #mcfl_mortgage_insurance_payment = mcfl_mortgage_insurance[1]

    # --------------------------------------------------------------------------------------------------------------- # 
    # Table Generation: Pandas Dataframe -> Raw HTML...

    mcf_dict = {"Years": years,
                "Months": months,
                "Monthly Rent": mcf_rent,
                "Renter's Insurance": mcf_rent_insur,
                "Renter's Cash Flow": mcf_rent_cashflow,
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
                "Unlevered Net Cash Flow": mcf_unlv_net_cf,
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
    

    #mcfTable(mcf_dict)
    
    #mcf_table = pd.DataFrame(data=mcf_dict).set_index(["Years","Months"]).transpose()

    #mcf_html = mcf_table.to_html(border=0)
    mcf_html = mcfTable(mcf_dict)

    return [mcf_html, mcf_rent, mcf_rent_insur, mcf_rent_cashflow, mcf_acquis, mcf_acquis_costs, mcf_sale, 
            mcf_dispo_costs, mcf_prop_tax, mcf_prop_tax_shield, mcf_insurance, mcf_maintenance, mcf_hoa_dues,
            mcf_unlv_own_cf, mcf_unlv_net_cf, mcfl_loan_proc, mcfl_loan_repay, mcfl_amort, mcfl_loan_points,
            mcfl_interest, mcfl_interest_tax_shield, mcfl_mortgage_insurance, mcfl_lv_own_cf, mcfl_lv_net_cf,
            mcfl_lv_ge, mcfl_lv_ne, mcfl_total_interest]

    #return mcf_html.to_html(border=0)

def mcfTable(dict):
    dict_key = ["Monthly Rent","Renter's Insurance","Renter's Cash Flow",
                "Acquisition","Acquisition Costs","Sale","Disposition Costs","Property Tax",
                "Property Tax Shield","Insurance","Maintenance","Condo Dues",
                "Unlevered Owner Cash Flow","Unlevered Net Cash Flow","Loan Proceeds",
                "Loan Repayment","Amortization","Loan Points","Interest","Interest Tax Shield",
                "Mortgage Insurance","Levered Owner Cash Flow","Levered Net Cash Flow",
                "Cum. Gross Equity","Cum. Net Equity"]

    
    response = '<table id="mcfTable"><thead>'
    y_response = '<tr><th class="mainHeader">Years</th>'
    m_response = '<tr><th class="mainHeader">Months</th>'
    item = 0

    # Generate the year/month table headers...
    for col in dict["Years"]:
        if item == 0:
            year = int(dict["Years"][item])
            y_response += '<td class="secondHeader">{}</td>'.format(year)
        elif (item % 12) == 0:
            year = int(dict["Years"][item])
            #y_response += '<th colspan="12" halign="left">{}</th>'.format(year)
            y_response += '<td class="secondHeader" colspan="12">{}</td>'.format(year)
        m_response += '<td class="secondHeader">{}</td>'.format(dict["Months"][item])
        item += 1
    
    y_response += "</tr>"
    m_response += "</tr>"
    response += y_response + m_response + '</thead><tbody>'

    # Generate the derived fields as individual rows...
    for key in dict_key:
        item = 0
        response += '<tr class="tableRow"><th class="minorHeader">{}</th>'.format(key)
        for col in dict[key]:
            value = np.round(dict[key][item],2)
            response += '<td>{:.2f}</td>'.format(value)
            item += 1
        response += "</tr>"

    response += "</tbody></table>"
    
    '''
    response = '<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table"><TableHead>'
    y_response = '<TableRow><TableCell>Years</TableCell>'
    m_response = '<TableRow><TableCell>Months</TableCell>'
    item = 0

    # Generate the year/month table headers...
    for col in dict["Years"]:
        if item == 0:
            year = int(dict["Years"][item])
            y_response += '<TableCell>{}</TableCell>'.format(year)
        elif (item % 12) == 0:
            year = int(dict["Years"][item])
            #y_response += '<th colspan="12" halign="left">{}</th>'.format(year)
            y_response += '<TableCell colspan="12">{}</TableCell>'.format(year)
        m_response += '<TableCell>{}</TableCell>'.format(dict["Months"][item])
        item += 1
    
    y_response += "</TableRow>"
    m_response += "</TableRow>"
    response += y_response + m_response + '</TableHead><TableBody>'
    
    # Generate the derived fields as individual rows...
    for key in dict_key:
        item = 0
        response += '<TableRow class="tableRow"><TableCell component="th" scope="row>{}</TableCell>'.format(key)
        for col in dict[key]:
            value = np.round(dict[key][item],2)
            response += '<TableCell>{:.2f}</TableCell>'.format(value)
            item += 1
        response += "</TableRow>"

    response += "</TableBody></Table>"
    '''

    #print(response)
    return response

# --------------------------------------------------------------------------------------------------------------- # 
    # Start of ACF Calculations...
# --------------------------------------------------------------------------------------------------------------- # 
    # Table Generation: Pandas Dataframe -> Raw HTML...

def gen_acf(hold_period, hold_period_m, mcf_rent, mcf_rent_insur, mcf_acquis, mcf_acquis_costs, mcf_sale, 
           mcf_dispo_costs, mcf_prop_tax, mcf_prop_tax_shield, mcf_insurance, mcf_maintenance, mcf_hoa_dues,
           loan_ltv_desired, mcfl_loan_repay, mortgage_points, mcfl_amort, mcfl_interest, mcfl_interest_tax_shield,
           mcfl_mortgage_insurance):
    
    # initialize the header lists for input later, standard incremental months/years...
    months = list(range(hold_period_m+1))
    years = np.zeros(hold_period_m+1)
    acf_months = np.zeros((hold_period_m+1)//12)

    for i in range(len(months)):
        years[i] = np.ceil(months[i]/12)

    acf_years = months[:hold_period+1]
    acf_months = np.zeros(hold_period+1)
    for i in range(1, hold_period+1):
        acf_months[i] = acf_years[i]*12

    acf_rent = np.zeros(hold_period+1)
    acf_rent_insur = np.zeros(hold_period+1)
    acf_rent_cashflow = np.zeros(hold_period+1)

    m = 1
    for i in range(12,hold_period_m+1,12):
        acf_rent[m] = np.sum(mcf_rent[i-11:i+1])
        acf_rent_insur[m] = np.sum(mcf_rent_insur[i-11:i+1])
        acf_rent_cashflow[m] = np.sum([acf_rent[m],acf_rent_insur[m]])
        m += 1
        
    acf_rent_total = np.sum(acf_rent)
    acf_rent_insur_total = np.sum(acf_rent_insur)
    acf_rent_cashflow_total = np.sum(acf_rent_cashflow)

    # --------------------------------------------------------------------------------------------------------------- #
    # Initialize zero arrays for all constant variables...
    acf_acquis = np.zeros(hold_period+1)
    acf_acquis_costs = np.zeros(hold_period+1)
    acf_sale = np.zeros(hold_period+1)
    acf_dispo_costs = np.zeros(hold_period+1)

    # Initialize variables not needing iteration...
    acf_acquis[0] = np.sum(mcf_acquis[0])
    acf_acquis_costs[0] = np.sum(mcf_acquis_costs[0])
    acf_sale[-1] = np.sum(mcf_sale[-1])
    acf_dispo_costs[-1] = np.sum(mcf_dispo_costs[-1])

    # Initialize zero arrays for all dynamic variables...
    acf_prop_tax = np.zeros(hold_period+1)
    acf_prop_tax_shield = np.zeros(hold_period+1)
    acf_insurance = np.zeros(hold_period+1)
    acf_maintenance = np.zeros(hold_period+1)
    acf_hoa_dues = np.zeros(hold_period+1)
    acf_unlv_own_cf = np.zeros(hold_period+1)
    acf_unlv_net_cf = np.zeros(hold_period+1)

    m = 1
    for i in range(12,hold_period_m+1,12):
        acf_prop_tax[m] = np.sum(mcf_prop_tax[i-11:i+1])
        acf_prop_tax_shield[m] = np.sum(mcf_prop_tax_shield[i-11:i+1])
        acf_insurance[m] = np.sum(mcf_insurance[i-11:i+1])
        acf_maintenance[m] = np.sum(mcf_maintenance[i-11:i+1])
        acf_hoa_dues[m] = np.sum(mcf_hoa_dues[i-11:i+1])
        m += 1
        
    for i in range(hold_period+1):
        if i == 0:
            acf_unlv_own_cf[i] = np.sum((acf_acquis[i], acf_acquis_costs[i]))
            acf_unlv_net_cf[i] = np.subtract(acf_unlv_own_cf[i],acf_rent_cashflow[i])
        elif i < hold_period:
            acf_unlv_own_cf[i] = np.sum((acf_dispo_costs[i],acf_prop_tax[i],acf_prop_tax_shield[i],acf_insurance[i],acf_maintenance[i],acf_hoa_dues[i]))
            acf_unlv_net_cf[i] = np.subtract(acf_unlv_own_cf[i],acf_rent_cashflow[i])
        else:
            acf_unlv_own_cf[i] = np.sum((acf_dispo_costs[i],acf_prop_tax[i],acf_prop_tax_shield[i],acf_insurance[i],acf_maintenance[i],acf_hoa_dues[i]))
            acf_unlv_own_cf[i] = np.sum([acf_unlv_own_cf[i], acf_sale[i]])
            acf_unlv_net_cf[i] = np.subtract(acf_unlv_own_cf[i],acf_rent_cashflow[i])
        
    acf_unlv_own_cashflow_total = np.sum(acf_unlv_own_cf)

    # --------------------------------------------------------------------------------------------------------------- #
    # Initialize zero arrays for all constant variables...
    acfl_loan_proc = np.zeros(hold_period+1)
    acfl_loan_repay = np.zeros(hold_period+1)
    acfl_loan_points = np.zeros(hold_period+1)

    # Initialize variables not needing iteration...
    acfl_loan_proc[0] = loan_ltv_desired
    acfl_loan_repay[-1] = np.sum(mcfl_loan_repay[-1])
    acfl_loan_points[0] = -mortgage_points

    # Initialize zero arrays for all dynamic variables...
    acfl_amort = np.zeros(hold_period+1)
    acfl_interest = np.zeros(hold_period+1)
    acfl_interest_tax_shield = np.zeros(hold_period+1)
    acfl_mortgage_insurance = np.zeros(hold_period+1)
    acfl_lv_own_cf = np.zeros(hold_period+1)
    acfl_lv_net_cf = np.zeros(hold_period+1)

    # Initialize preliminary values...
    acfl_lv_own_cf = np.zeros(hold_period+1)
    acfl_lv_net_cf = np.zeros(hold_period+1)
    acfl_lv_ge = np.zeros(hold_period+1)
    acfl_lv_ne = np.zeros(hold_period+1)

    acf_year=1
    for i in range(12,hold_period_m+1,12):
        if acf_year > 0 and acf_year <= hold_period:
            acfl_amort[acf_year] = np.sum(mcfl_amort[i-11:i+1])
            acfl_interest[acf_year] = np.sum(mcfl_interest[i-11:i+1])
            acfl_interest_tax_shield[acf_year] = np.sum(mcfl_interest_tax_shield[i-11:i+1])
            acfl_mortgage_insurance[acf_year] = np.sum(mcfl_mortgage_insurance[i-11:i+1])
        acf_year += 1

    for i in range(hold_period+1):
        if i == 0:
            acfl_lv_own_cf[i] = np.sum([acf_unlv_own_cf[i],acfl_loan_proc[i],acfl_loan_points[i]])
            acfl_lv_net_cf[i] = np.subtract(acfl_lv_own_cf[i],acf_rent_cashflow[i])
            acfl_lv_ge[i] = acfl_lv_own_cf[i]
            acfl_lv_ne[i] = acfl_lv_net_cf[i]
        elif i < hold_period:
            acfl_lv_own_cf[i] = np.sum([acf_unlv_own_cf[i], acfl_loan_proc[i], acfl_loan_repay[i], acfl_amort[i], acfl_loan_points[i], acfl_interest[i], acfl_interest_tax_shield[i], acfl_mortgage_insurance[i]])
            acfl_lv_net_cf[i] = np.subtract(acfl_lv_own_cf[i],acf_rent_cashflow[i])
            acfl_lv_ge[i] = acfl_lv_ge[i-1] + acfl_lv_own_cf[i]
            acfl_lv_ne[i] = acfl_lv_ne[i-1] + acfl_lv_net_cf[i]
        else:
            acfl_lv_own_cf[i] = np.sum([acf_unlv_own_cf[i], acfl_loan_proc[i], acfl_loan_repay[i], acfl_amort[i], acfl_loan_points[i], acfl_interest[i], acfl_interest_tax_shield[i], acfl_mortgage_insurance[i]])
            acfl_lv_net_cf[i] = np.subtract(acfl_lv_own_cf[i],acf_rent_cashflow[i])
            acfl_lv_ge[i] = acfl_lv_ge[i-1] + acfl_lv_own_cf[i]
            acfl_lv_ne[i] = acfl_lv_ne[i-1] + acfl_lv_net_cf[i]

    # --------------------------------------------------------------------------------------------------------------- # 
    # Table Generation: Pandas Dataframe -> Raw HTML...
            
    acf_dict = {"Years": acf_years,
                    "Months": acf_months,
                    "Monthly Rent": acf_rent,
                    "Renter's Insurance": acf_rent_insur,
                    "Renter's Cash Flow": acf_rent_cashflow,
                    "Acquisition": acf_acquis,
                    "Acquisition Costs": acf_acquis_costs,
                    "Sale": acf_sale,
                    "Disposition Costs": acf_dispo_costs,
                    "Property Tax": acf_prop_tax,
                    "Property Tax Shield": acf_prop_tax_shield,
                    "Insurance": acf_insurance,
                    "Maintenance": acf_maintenance,
                    "Condo Dues": acf_hoa_dues,
                    "Unlevered Owner Cash Flow": acf_unlv_own_cf,
                    "Unlevered Net Cash Flow": acf_unlv_net_cf,
                    "Loan Proceeds": acfl_loan_proc,
                    "Loan Repayment": acfl_loan_repay,
                    "Amortization": acfl_amort,
                    "Loan Points": acfl_loan_points,
                    "Interest": acfl_interest,
                    "Interest Tax Shield": acfl_interest_tax_shield,
                    "Mortgage Insurance": acfl_mortgage_insurance,
                    "Levered Owner Cash Flow": acfl_lv_own_cf,
                    "Levered Net Cash Flow": acfl_lv_net_cf,
                    "Cum. Gross Equity": acfl_lv_ge,
                    "Cum. Net Equity": acfl_lv_ne}
    
    #acf_table = pd.DataFrame(data=acf_dict).set_index(["Years","Months"]).transpose()
    #acf_html = acf_table.to_html(border=0)
    acf_html = acfTable(acf_dict)

    return [acf_html, acf_rent, acf_rent_insur, acf_rent_cashflow, acf_acquis, acf_acquis_costs, acf_sale, 
            acf_dispo_costs, acf_prop_tax, acf_prop_tax_shield, acf_insurance, acf_maintenance, acf_hoa_dues, 
            acf_unlv_own_cf, acf_unlv_net_cf, acfl_loan_proc, acfl_loan_repay, acfl_amort, acfl_loan_points, 
            acfl_interest, acfl_interest_tax_shield, acfl_mortgage_insurance, acfl_lv_own_cf, acfl_lv_net_cf, 
            acfl_lv_ge, acfl_lv_ne, acf_unlv_own_cashflow_total, acf_rent_total, acf_rent_insur_total, 
            acf_rent_cashflow_total]


# --------------------------------------------------------------------------------------------------------------- # 

def acfTable(dict):
    dict_key = ["Monthly Rent","Renter's Insurance","Renter's Cash Flow",
                "Acquisition","Acquisition Costs","Sale","Disposition Costs","Property Tax",
                "Property Tax Shield","Insurance","Maintenance","Condo Dues",
                "Unlevered Owner Cash Flow","Unlevered Net Cash Flow","Loan Proceeds",
                "Loan Repayment","Amortization","Loan Points","Interest","Interest Tax Shield",
                "Mortgage Insurance","Levered Owner Cash Flow","Levered Net Cash Flow",
                "Cum. Gross Equity","Cum. Net Equity"]

    
    response = '<table id="acfTable"><thead>'
    y_response = '<tr><th class="mainACFHeader">Years</th>'
    m_response = '<tr><th class="mainACFHeader">Months</th>'
    item = 0

    # Generate the year/month table headers...
    for col in dict["Years"]:
        year = int(dict["Years"][item])
        month = int(dict["Months"][item])
        y_response += '<td class="secondACFHeader">{}</td>'.format(year)
        m_response += '<td class="secondACFHeader">{}</td>'.format(month)
        item += 1
    
    y_response += "</tr>"
    m_response += "</tr>"
    response += y_response + m_response + '</thead><tbody>'

    # Generate the derived fields as individual rows...
    for key in dict_key:
        item = 0
        response += '<tr class="tableRow"><th class="minorHeader">{}</th>'.format(key)
        for col in dict[key]:
            value = np.round(dict[key][item],2)
            response += '<td>{:.2f}</td>'.format(value)
            item += 1
        response += "</tr>"

    response += "</tbody></table>"
    

    #print(response)
    return response

    
# XIRR Function Definition...

def xnpv(rate, values, dates):
    '''Equivalent of Excel's XNPV function.

    >>> from datetime import date
    >>> dates = [date(2010, 12, 29), date(2012, 1, 25), date(2012, 3, 8)]
    >>> values = [-10000, 20, 10100]
    >>> xnpv(0.1, values, dates)
    -966.4345...
    '''
    
    if rate <= -1.0:
        return float('inf')
    d0 = dates[0]    # or min(dates)
    return sum([ vi / (1.0 + rate)**((di - d0).days / 365.0) for vi, di in zip(values, dates)])

def xirr(values, dates):
    '''Equivalent of Excel's XIRR function.

    >>> from datetime import date
    >>> dates = [date(2010, 12, 29), date(2012, 1, 25), date(2012, 3, 8)]
    >>> values = [-10000, 20, 10100]
    >>> xirr(values, dates)
    0.0100612...
    '''
    #today = date.today()
    #dates = []
    #for i in range(len(hold_period_m)):
        #next_month = today + relativedelta(months = i)
        #dates.append(next_month)
    #print(dates)

    try:
        return scipy.optimize.newton(lambda r: xnpv(r, values, dates), 0.0)
    except RuntimeError:    # Failed to converge?
    #except RuntimeWarning:
        return scipy.optimize.brentq(lambda r: xnpv(r, values, dates), -1.0, 1e10)
    