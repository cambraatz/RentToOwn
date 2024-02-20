from django.db import models
from django.utils import timezone
import datetime
import pandas as pd
import numpy as np
from django.db.models import F
from computed_property import ComputedCharField, ComputedTextField, ComputedIntegerField
from django.contrib.postgres.fields import ArrayField


# Helper Functions for deriving model properties...

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

# Create your models here.

class DataField(models.Model):
    user_id = models.CharField(max_length=50, default='')
    purchase_price = models.IntegerField()
    hold_period = models.IntegerField()
    hold_period_m = models.IntegerField()

    apartment_rent = models.IntegerField()
    parking_rent = models.IntegerField()
    renters_insurance = models.IntegerField()
    monthly_rent = models.IntegerField()

    rate_capital_gains = models.FloatField(max_length=4)
    rate_federal_tax = models.FloatField(max_length=4)
    bool_federal = models.BooleanField()
    salt_limit = models.IntegerField()
    bool_salt = models.BooleanField()
    rent_growth = models.FloatField(max_length=4)
    home_appreciation = models.FloatField(max_length=4)
    ret_inflation = models.FloatField(max_length=4)
    other_inflation = models.FloatField(max_length=4)

    fee_inspection = models.IntegerField()
    fee_appraisal = models.IntegerField()
    fee_legal = models.IntegerField()
    rate_title_insurance_aq = models.FloatField(max_length=4)
    title_insurance_aq = models.FloatField(max_length=8)
    lender_costs_other = models.IntegerField()
    rate_transfer_tax_aq = models.FloatField(max_length=4)
    transfer_tax_aq = models.FloatField(max_length=8)
    total_acquisition = models.FloatField(max_length=8)

    rate_title_insurance_dis = models.FloatField(max_length=4)
    title_insurance_dis = models.FloatField(max_length=8)
    rate_transfer_tax_dis = models.FloatField(max_length=4)
    transfer_tax_dis = models.FloatField(max_length=8)
    rate_brokerage = models.FloatField(max_length=8)
    fee_brokerage = models.FloatField(max_length=4)
    total_disposition = models.FloatField(max_length=9)

    rate_property_tax = models.FloatField(max_length=4)
    property_tax = models.FloatField(max_length=8)
    rate_home_insurance = models.FloatField(max_length=4)
    home_insurance = models.FloatField(max_length=8)
    rate_home_maintenance = models.FloatField(max_length=4)
    home_maintenance = models.FloatField(max_length=8)
    rate_hoa_util = models.FloatField(max_length=4)
    hoa_util = models.FloatField(max_length=6)

    rate_ltv_max = models.IntegerField()
    loan_ltv_max = models.IntegerField()
    loan_ltv_desired = models.FloatField(max_length=8)
    rate_ltv_desired = models.FloatField(max_length=4)
    rate_home_loan = models.FloatField(max_length=4)
    amort_home_loan = models.IntegerField()
    rate_mortgage_insurance = models.FloatField(max_length=4)
    clear_mortgage_insurance = models.IntegerField()
    rate_mortgage_points = models.FloatField(max_length=4)
    mortgage_points = models.FloatField(max_length=6)

    MCF = models.TextField(default="")
    ACF = models.TextField(default="")
    total_interest = models.FloatField(max_length=8, default=27861)
    mortgage_insurance_payment = models.FloatField(max_length=8, default=40111)
    amortization = models.FloatField(max_length=6, default=4373)

    initial_equity_NOR = models.FloatField(max_length=7, default=111750)
    initial_equity_GROSS = models.FloatField(max_length=7, default=111750)
    max_equity_NOR = models.FloatField(max_length=7, default=111750)
    max_equity_GROSS = models.FloatField(max_length=7, default=281846)
    profit_NOR = models.FloatField(max_length=7, default=101631)
    profit_GROSS = models.FloatField(max_length=7, default=-111796)
    unlv_irr_NOR = models.FloatField(max_length=5, default=0.076)
    unlv_irr_GROSS = models.FloatField(max_length=5, default=-0.07)
    lv_irr_NOR = models.FloatField(max_length=5, default=0.155)
    lv_irr_GROSS = models.FloatField(max_length=5, default=-0.144)
    lv_em_NOR = models.FloatField(max_length=5, default=1.91)
    lv_em_GROSS = models.FloatField(max_length=5, default=0.60)
