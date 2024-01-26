from django.shortcuts import render
from rest_framework import generics, status
from .serializers import DataFieldSerializer, CreateDataSerializer
from .models import DataField
from rest_framework.views import APIView
from rest_framework.response import Response
#import App from "../frontend/src/components/App"
import requests

from .CF_Tables import gen_mcf_table#, gen_mcf_rent_table, gen_mcf_UL_own_table

import numpy as np
import pandas as pd

field_inputs = ['user_id','purchase_price','hold_period','hold_period_m','apartment_rent','parking_rent',
                'renters_insurance','monthly_rent','rate_capital_gains','rate_federal_tax','bool_federal', 
                'salt_limit','bool_salt','rent_growth','home_appreciation','ret_inflation','other_inflation',
                'fee_inspection','fee_appraisal','fee_legal','rate_title_insurance_aq','title_insurance_aq', 
                'lender_costs_other','rate_transfer_tax_aq','transfer_tax_aq','total_acquisition',
                'rate_title_insurance_dis','title_insurance_dis','rate_transfer_tax_dis','transfer_tax_dis', 
                'rate_brokerage','fee_brokerage','total_disposition','rate_property_tax','property_tax',
                'rate_home_insurance','home_insurance','rate_home_maintenance','home_maintenance','rate_hoa_util', 
                'hoa_util','rate_ltv_max','loan_ltv_max','loan_ltv_desired','rate_ltv_desired','rate_home_loan',
                'amort_home_loan','rate_mortgage_insurance','clear_mortgage_insurance','rate_mortgage_points',
                'mortgage_points','mcf_table','total_rcf', 'mcfu_table', 'gross_sale_30y', 'total_uocf',
                'mcfl_table', 'total_locf']


# Create your views here.
class DataFieldView(generics.ListAPIView):
    queryset = DataField.objects.all()
    serializer_class = DataFieldSerializer

class GetData(APIView):
    serializer_class = DataFieldSerializer
    lookup_url_kwarg = 'user_id'

    def get(self, request, format=None):
        user_id = request.GET.get(self.lookup_url_kwarg)
        if user_id != None:
            datafield = DataField.objects.filter(user_id=user_id)
            if len(datafield) > 0:
                data = DataFieldSerializer(datafield[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'User Not Found': 'Invalid User Id'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code Parameter Not Found In Request'}, status=status.HTTP_400_BAD_REQUEST)

class CreateDataView(APIView):
    serializer_class = CreateDataSerializer

    def post(self, request, format=None):
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        
        #session = requests.Session()
        #cookies = session.cookies.get_dict()
        #user = session.cookies['user']
        #print(user)
        #user_id = self.request.session.cookies.get
        #if user_id != None:

        if serializer.is_valid():
            user_id = serializer.data.get('user_id')
            purchase_price = serializer.data.get('purchase_price')
            hold_period = serializer.data.get('hold_period')
            hold_period_m = serializer.data.get('hold_period_m')
            apartment_rent = serializer.data.get('apartment_rent')
            parking_rent = serializer.data.get('parking_rent')
            renters_insurance = serializer.data.get('renters_insurance')
            monthly_rent = serializer.data.get('monthly_rent')
            rate_capital_gains = serializer.data.get('rate_capital_gains')
            rate_federal_tax = serializer.data.get('rate_federal_tax')
            bool_federal = serializer.data.get('bool_federal')
            salt_limit = serializer.data.get('salt_limit')
            bool_salt = serializer.data.get('bool_salt')
            rent_growth = serializer.data.get('rent_growth')
            home_appreciation = serializer.data.get('home_appreciation')
            ret_inflation = serializer.data.get('ret_inflation')
            other_inflation = serializer.data.get('other_inflation')
            fee_inspection = serializer.data.get('fee_inspection')
            fee_appraisal = serializer.data.get('fee_appraisal')
            fee_legal = serializer.data.get('fee_legal')
            rate_title_insurance_aq = serializer.data.get('rate_title_insurance_aq')
            title_insurance_aq = serializer.data.get('title_insurance_aq')
            lender_costs_other = serializer.data.get('lender_costs_other')
            rate_transfer_tax_aq = serializer.data.get('rate_transfer_tax_aq')
            transfer_tax_aq = serializer.data.get('transfer_tax_aq')
            total_acquisition = serializer.data.get('total_acquisition')
            rate_title_insurance_dis = serializer.data.get('rate_title_insurance_dis')
            title_insurance_dis = serializer.data.get('title_insurance_dis')
            rate_transfer_tax_dis = serializer.data.get('rate_transfer_tax_dis')
            transfer_tax_dis = serializer.data.get('transfer_tax_dis')
            rate_brokerage = serializer.data.get('rate_brokerage')
            fee_brokerage = serializer.data.get('fee_brokerage')
            total_disposition = serializer.data.get('total_disposition')
            rate_property_tax = serializer.data.get('rate_property_tax')
            property_tax = serializer.data.get('property_tax')
            rate_home_insurance = serializer.data.get('rate_home_insurance')
            home_insurance = serializer.data.get('home_insurance')
            rate_home_maintenance = serializer.data.get('rate_home_insurance')
            home_maintenance = serializer.data.get('home_maintenance')
            rate_hoa_util = serializer.data.get('rate_hoa_util')
            hoa_util = serializer.data.get('hoa_util')
            rate_ltv_max = serializer.data.get('rate_ltv_max')
            loan_ltv_max = serializer.data.get('loan_ltv_max')
            loan_ltv_desired = serializer.data.get('loan_ltv_desired')
            rate_ltv_desired = serializer.data.get('rate_ltv_desired')
            rate_home_loan = serializer.data.get('rate_home_loan')
            amort_home_loan = serializer.data.get('amort_home_loan')
            rate_mortgage_insurance = serializer.data.get('rate_mortgage_insurance')
            clear_mortgage_insurance = serializer.data.get('clear_mortgage_insurance')
            rate_mortgage_points = serializer.data.get('rate_mortgage_points')
            mortgage_points = serializer.data.get('mortgage_points')

            # --------------------------------------------------------------------------------------------------------------- # 
            # gen_mcf_rent_table() computes monthly cash flow and returns raw HTML table and total rent cash flow...

            #MCFR = gen_mcf_rent_table(hold_period_m, monthly_rent, rent_growth, renters_insurance)
            MCF = gen_mcf_table(purchase_price, hold_period, hold_period_m, monthly_rent, rent_growth, renters_insurance, 
                                bool_federal, rate_federal_tax, bool_salt, salt_limit, total_acquisition, home_appreciation, 
                                ret_inflation, other_inflation, total_disposition, property_tax, home_insurance, 
                                home_maintenance, hoa_util, loan_ltv_desired, rate_ltv_desired, rate_home_loan, amort_home_loan, 
                                rate_mortgage_insurance, clear_mortgage_insurance, mortgage_points)
            mcf_table = MCF[0]
            total_rcf = MCF[1]
            mcfu_table = MCF[2]
            gross_sale_30y = MCF[3]
            total_uocf = MCF[4]
            mcfl_table = MCF[5]
            total_locf = MCF[6]

            # --------------------------------------------------------------------------------------------------------------- # 
            # gen_mcf_UL_own_table() computes monthly cash flow and returns raw HTML table and total unlevered own cash flow...

            #MCFU = gen_mcf_UL_own_table(purchase_price, hold_period, hold_period_m, bool_federal, rate_federal_tax, bool_salt, 
            #                            salt_limit, total_acquisition, home_appreciation, ret_inflation, other_inflation, 
            #                            total_disposition, property_tax, home_insurance, home_maintenance, hoa_util)
            #mcfu_table = MCFU[0]
            #mcfu_gross_sale_30y = MCFU[1]
            #total_uocf = MCFU[2]

            queryset = DataField.objects.filter(user_id=user_id)
            if queryset.exists():
                datafield = queryset[0]

                datafield.user_id = user_id
                datafield.purchase_price = purchase_price
                datafield.hold_period = hold_period
                datafield.hold_period_m = hold_period_m
                datafield.apartment_rent = apartment_rent
                datafield.parking_rent = parking_rent
                datafield.renters_insurance = renters_insurance
                datafield.monthly_rent = monthly_rent
                datafield.rate_capital_gains = rate_capital_gains
                datafield.rate_federal_tax = rate_federal_tax
                datafield.bool_federal = bool_federal
                datafield.salt_limit = salt_limit
                datafield.bool_salt = bool_salt
                datafield.rent_growth = rent_growth
                datafield.home_appreciation = home_appreciation
                datafield.ret_inflation = ret_inflation
                datafield.other_inflation = other_inflation
                datafield.fee_inspection = fee_inspection
                datafield.fee_appraisal = fee_appraisal
                datafield.fee_legal = fee_legal
                datafield.rate_title_insurance_aq = rate_title_insurance_aq
                datafield.title_insurance_aq = title_insurance_aq
                datafield.lender_costs_other = lender_costs_other
                datafield.rate_transfer_tax_aq = rate_transfer_tax_aq
                datafield.transfer_tax_aq = transfer_tax_aq
                datafield.total_acquisition = total_acquisition
                datafield.rate_title_insurance_dis = rate_title_insurance_dis
                datafield.title_insurance_dis = title_insurance_dis
                datafield.rate_transfer_tax_dis = rate_transfer_tax_dis
                datafield.transfer_tax_dis = transfer_tax_dis
                datafield.rate_brokerage = rate_brokerage
                datafield.fee_brokerage = fee_brokerage
                datafield.total_disposition = total_disposition
                datafield.rate_property_tax = rate_property_tax
                datafield.property_tax = property_tax
                datafield.rate_home_insurance = rate_home_insurance
                datafield.home_insurance = home_insurance
                datafield.rate_home_maintenance = rate_home_maintenance
                datafield.home_maintenance = home_maintenance
                datafield.rate_hoa_util = rate_hoa_util
                datafield.hoa_util = hoa_util
                datafield.rate_ltv_max = rate_ltv_max
                datafield.loan_ltv_max = loan_ltv_max
                datafield.loan_ltv_desired = loan_ltv_desired
                datafield.rate_ltv_desired = rate_ltv_desired
                datafield.rate_home_loan = rate_home_loan
                datafield.amort_home_loan = amort_home_loan
                datafield.rate_mortgage_insurance = rate_mortgage_insurance
                datafield.clear_mortgage_insurance = clear_mortgage_insurance
                datafield.rate_mortgage_points = rate_mortgage_points
                datafield.mortgage_points = mortgage_points

                datafield.mcf_table = mcf_table
                datafield.total_rcf = total_rcf
                datafield.mcfu_table = mcfu_table
                datafield.gross_sale_30y = gross_sale_30y
                datafield.total_uocf = total_uocf
                datafield.mcfl_table = mcfl_table
                datafield.total_locf = total_locf

                datafield.save(update_fields=field_inputs)
                return Response(DataFieldSerializer(datafield).data, status=status.HTTP_200_OK)
            else:
                datafield = DataField(user_id=user_id, purchase_price=purchase_price,
                                      hold_period=hold_period, hold_period_m=hold_period_m,
                                      apartment_rent=apartment_rent, parking_rent=parking_rent,
                                      renters_insurance=renters_insurance, monthly_rent=monthly_rent,
                                      rate_capital_gains=rate_capital_gains, rate_federal_tax=rate_federal_tax,
                                      bool_federal=bool_federal, salt_limit=salt_limit, bool_salt=bool_salt,
                                      rent_growth=rent_growth, home_appreciation=home_appreciation,
                                      ret_inflation=ret_inflation, other_inflation=other_inflation,
                                      fee_inspection=fee_inspection, fee_appraisal=fee_appraisal,
                                      fee_legal=fee_legal, rate_title_insurance_aq=rate_title_insurance_aq,
                                      title_insurance_aq=title_insurance_aq, lender_costs_other=lender_costs_other,
                                      rate_transfer_tax_aq=rate_transfer_tax_aq, transfer_tax_aq=transfer_tax_aq,
                                      total_acquisition=total_acquisition, rate_title_insurance_dis=rate_title_insurance_dis,
                                      title_insurance_dis=title_insurance_dis, rate_transfer_tax_dis=rate_transfer_tax_dis,
                                      transfer_tax_dis=transfer_tax_dis, rate_brokerage=rate_brokerage,
                                      fee_brokerage=fee_brokerage, total_disposition=total_disposition,
                                      rate_property_tax=rate_property_tax, property_tax=property_tax,
                                      rate_home_insurance=rate_home_insurance, home_insurance=home_insurance,
                                      rate_home_maintenance=rate_home_maintenance, home_maintenance=home_maintenance,
                                      rate_hoa_util=rate_hoa_util, hoa_util=hoa_util, rate_ltv_max=rate_ltv_max,
                                      loan_ltv_max=loan_ltv_max, loan_ltv_desired=loan_ltv_desired,
                                      rate_ltv_desired=rate_ltv_desired, rate_home_loan=rate_home_loan,
                                      amort_home_loan=amort_home_loan, rate_mortgage_insurance=rate_mortgage_insurance,
                                      clear_mortgage_insurance=clear_mortgage_insurance, rate_mortgage_points=rate_mortgage_points,
                                      mortgage_points=mortgage_points, mcf_table=MCF[0], total_rcf=MCF[1], 
                                      mcfu_table = MCF[2], gross_sale_30y = MCF[3], total_uocf = MCF[4], 
                                      mcfl_table = MCF[5], total_locf = MCF[6])
                datafield.save()
                return Response(DataFieldSerializer(datafield).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


'''
class tableView(APIView):
    serializer_class = createTableSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # MCF Rent Scenario: Gathers data and generates monthly cash flow for renting...
            hold_period_m = serializer.data.get('hold_period_m')
            monthly_rent = serializer.data.get('monthly_rent')
            rent_growth = serializer.data.get('rent_growth')
            renters_insurance = serializer.data.get('renters_insurance')

            months = list(range(hold_period_m + 1))
            years = np.zeros(hold_period_m + 1)
            acf_months = np.zeros((hold_period_m + 1)//12)

            for i in range(len(months)):
                years[i] = np.ceil(months[i]/12)

            mcf_month = 1
            mcf_year = 0

            mcf_rent = mcf_rent_func(mcf_month, mcf_year, hold_period_m, monthly_rent, rent_growth, hold_period_m)
            mcf_rent_insur = mcf_rent_func(mcf_month, mcf_year, hold_period_m, (renters_insurance / 12), rent_growth, hold_period_m)
            mcf_rent_cashflow = mcf_rent_generate(mcf_rent, mcf_rent_insur, hold_period_m)
            total_rcf = np.sum(mcf_rent_cashflow)
            print(total_rcf)

            mcf_rent_dict = {"Years": years,
                    "Months": months,
                    "Monthly Rent": mcf_rent,
                    "Renter's Insurance": mcf_rent_insur,
                    "Renter's Cash Flow": mcf_rent_cashflow}
            
            mcf_rent_table = pd.DataFrame(data=mcf_rent_dict).set_index(["Years","Months"])

# Table Generator Helper Functions Live Here (import later)...

# mcf_rent_func() computes monthly rent appreciation across study period...
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

# mcf_rent_populate() computes monthly rent costs across study period...
def mcf_rent_generate(mcf_rent, mcf_rent_insur, hold_period_m):
    mcf_rent_cashflow = np.zeros(hold_period_m+1)
    for i in range(hold_period_m+1):
        mcf_rent_cashflow[i] = mcf_rent[i] + mcf_rent_insur[i]
    return mcf_rent_cashflow
'''

'''
                datafield.user_id = user_id
                datafield.purchase_price = purchase_price
                datafield.hold_period = hold_period 
                datafield.hold_period_m = hold_period_m
                datafield.apartment_rent=apartment_rent
                datafield.parking_rent=parking_rent
                datafield.renters_insurance=renters_insurance
                datafield.monthly_rent=monthly_rent
                datafield.rate_capital_gains=rate_capital_gains
                datafield.rate_federal_tax=rate_federal_tax
                datafield.bool_federal=bool_federal
                datafield.salt_limit=salt_limit
                datafield.bool_salt=bool_salt
                datafield.rent_growth=rent_growth
                datafield.home_appreciation=home_appreciation
                datafield.ret_inflation=ret_inflation
                datafield.other_inflation=other_inflation
                datafield.fee_inspection=fee_inspection
                datafield.fee_appraisal=fee_appraisal
                datafield.fee_legal=fee_legal
                datafield.rate_title_insurance_aq=rate_title_insurance_aq
                datafield.title_insurance_aq=title_insurance_aq
                datafield.lender_costs_other=lender_costs_other
                datafield.rate_transfer_tax_aq=rate_transfer_tax_aq
                datafield.transfer_tax_aq=transfer_tax_aq
                datafield.total_acquisition=total_acquisition
                datafield.rate_title_insurance_dis=rate_title_insurance_dis
                datafield.title_insurance_dis=title_insurance_dis
                datafield.rate_transfer_tax_dis=rate_transfer_tax_dis
                datafield.transfer_tax_dis=transfer_tax_dis
                datafield.rate_brokerage=rate_brokerage
                datafield.fee_brokerage=fee_brokerage
                datafield.total_disposition=total_disposition
                datafield.rate_property_tax=rate_property_tax
                datafield.property_tax=property_tax
                datafield.rate_home_insurance=rate_home_insurance
                datafield.home_insurance=home_insurance
                datafield.rate_home_maintenance=rate_home_maintenance
                datafield.home_maintenance=home_maintenance
                datafield.rate_hoa_util=rate_hoa_util
                datafield.hoa_util=hoa_util
                datafield.rate_ltv_max=rate_ltv_max
                datafield.loan_ltv_max=loan_ltv_max
                datafield.loan_ltv_desired=loan_ltv_desired
                datafield.rate_ltv_desired=rate_ltv_desired
                datafield.rate_home_loan=rate_home_loan
                datafield.amort_home_loan=amort_home_loan
                datafield.rate_mortgage_insurance=rate_mortgage_insurance
                datafield.clear_mortgage_insurance=clear_mortgage_insurance
                datafield.rate_mortgage_points=rate_mortgage_points
                datafield.mortgage_points=mortgage_points
                '''