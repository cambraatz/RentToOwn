import sqlite3
from sqlite3 import Error

import numpy as np
#from scipy import optimize
#import numpy_financial as npf
import pandas as pd
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

'''
def create_connection(db_file):
    conn = None
    try:
        conn=sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def select_all_data(conn):
    cur = conn.cursor()
    cur.execute("SELECT * FROM datafields")

    rows = cur.fetchall()

    for row in rows:
        print(row)

def main():
    database = r"C:\Users\camer\Desktop\Apps\RentToOwn\calculator\db.sqlite3"

    conn = create_connection(database)
    with conn:
        print("Database Query:")
        select_all_data(conn)

if __name__ == '__main__':
    main()

#connection = sqlite3.connect("../../db.sqlite3")
#cursor = connection.cursor()
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

# --------------------------------------------------------------------------------------------------------------- # 
'''
Monthly Cash Flow Calculations
'''
# initialize the header lists for input later, standard incremental months/years...
months = list(range(hold_period_m+1))
years = np.zeros(hold_period_m+1)
acf_months = np.zeros((hold_period_m+1)//12)

for i in range(len(months)):
    years[i] = np.ceil(months[i]/12)
    
#print(months)
#print(years)

# initialize the arguments to their starting values...
mcf_month = 1
mcf_year = 0

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

# --------------------------------------------------------------------------------------------------------------- # 
# mcf_rent_func() computes monthly rent appreciation across extent of study period...

def gen_mcf_rent_table():
    mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m)
    mcf_rent_insur = mcf_rent_func(mcf_month, mcf_year, hold_period_m, (renters_insurance / 12), rent_growth, hold_period_m)
    mcf_rent_cashflow = np.zeros(hold_period_m+1)
    for i in range(hold_period_m+1):
        # These two lines populate flat rate renter's insurance, comment out for appreciation...
        #if i > 0:
            #mcf_rent_insur[i] = renters_insurance/12
        mcf_rent_cashflow[i] = mcf_rent[i] + mcf_rent_insur[i]

    #total_rcf = np.sum(mcf_rent_cashflow)
    #print("Total Renter Cash Flow: ${}".format(total_rcf))

    mcf_rent_dict = {"Years": years,
                    "Months": months,
                    "Monthly Rent": mcf_rent,
                    "Renter's Insurance": mcf_rent_insur,
                    "Renter's Cash Flow": mcf_rent_cashflow}

    #mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).iloc[47:,:]
    mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"]).transpose()
    #mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])
    #mcf_rent_table

    mcfr_html = mcf_rent_table.to_html(border=0)
    #print(mcfr_html)
    return mcfr_html

# --------------------------------------------------------------------------------------------------------------- #
# Populate all renter's fields across study period, rounding has been avoided as to not effect future calculations...

mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m)
#mcf_rent = list(np.around(np.array(mcf_rent),0))

# These two lines populate renter's insurance appreciation, comment out for flat rate...
mcf_rent_insur = mcf_rent_func(mcf_month, mcf_year, hold_period_m, (renters_insurance / 12), rent_growth, hold_period_m)
#mcf_rent_insur = list(np.around(np.array(mcf_rent_insur),0))

mcf_rent_cashflow = np.zeros(hold_period_m+1)
for i in range(hold_period_m+1):
    # These two lines populate flat rate renter's insurance, comment out for appreciation...
    #if i > 0:
        #mcf_rent_insur[i] = renters_insurance/12
    mcf_rent_cashflow[i] = mcf_rent[i] + mcf_rent_insur[i]
    
# --------------------------------------------------------------------------------------------------------------- #
# Sum renter's cash flow, NOTE: sum rounding error accounts for ~$5 in excess of original model...

total_rcf = np.sum(mcf_rent_cashflow)
print("Total Renter Cash Flow: ${}".format(total_rcf))