from django.shortcuts import render
from rest_framework import generics, status
from .serializers import DataFieldSerializer, CreateDataSerializer
from .models import DataField
from rest_framework.views import APIView
from rest_framework.response import Response
#import App from "../frontend/src/components/App"
import requests

from .CF_Tables import gen_mcf, gen_acf, xnpv, xirr
#from pyxirr import xirr
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
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
                'mortgage_points', 'MCF', 'ACF', 'total_interest', 'mortgage_insurance_payment', 'amortization',
                'initial_equity_NOR', 'initial_equity_GROSS', 'max_equity_NOR', 'max_equity_GROSS', 'profit_NOR',
                'profit_GROSS', 'unlv_irr_NOR', 'unlv_irr_GROSS', 'lv_irr_NOR', 'lv_irr_GROSS', 'lv_em_NOR',
                'lv_em_GROSS']


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
            MCF = serializer.data.get('MCF')
            ACF = serializer.data.get('ACF')
            total_interest = serializer.data.get('mcfl_total_interest')
            mortgage_insurance_payment = serializer.data.get('mortgage_insurance_payment')
            amortization = serializer.data.get('amortization')

            initial_equity_NOR = serializer.data.get('initial_equity_NOR')
            initial_equity_GROSS = serializer.data.get('initial_equity_GROSS')
            max_equity_NOR = serializer.data.get('max_equity_NOR')
            max_equity_GROSS = serializer.data.get('max_equity_GROSS')
            profit_NOR = serializer.data.get('profit_NOR')
            profit_GROSS = serializer.data.get('profit_GROSS')
            unlv_irr_NOR = serializer.data.get('unlv_irr_NOR')
            unlv_irr_GROSS = serializer.data.get('unlv_irr_GROSS')
            lv_irr_NOR = serializer.data.get('lv_irr_NOR')
            lv_irr_GROSS = serializer.data.get('lv_irr_GROSS')
            lv_em_NOR = serializer.data.get('lv_em_NOR')
            lv_em_GROSS = serializer.data.get('lv_em_GROSS')


            # --------------------------------------------------------------------------------------------------------------- # 
            # gen_mcf_rent_table() computes monthly cash flow and returns raw HTML table and total rent cash flow...

            #MCFR = gen_mcf_rent_table(hold_period_m, monthly_rent, rent_growth, renters_insurance)
            '''
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
            mcfr_table = MCF[7]
            '''
            MCF = gen_mcf(purchase_price, hold_period, hold_period_m, monthly_rent, rent_growth, renters_insurance, 
                                bool_federal, rate_federal_tax, bool_salt, salt_limit, total_acquisition, home_appreciation, 
                                ret_inflation, other_inflation, total_disposition, property_tax, home_insurance, 
                                home_maintenance, hoa_util, loan_ltv_desired, rate_ltv_desired, rate_home_loan, amort_home_loan, 
                                rate_mortgage_insurance, clear_mortgage_insurance, mortgage_points)

            mcf_html = MCF[0]
            mcf_rent = MCF[1]
            mcf_rent_insur = MCF[2]
            mcf_rent_cashflow = MCF[3]
            mcf_acquis = MCF[4]
            mcf_acquis_costs = MCF[5]
            mcf_sale = MCF[6]
            mcf_dispo_costs = MCF[7]
            mcf_prop_tax = MCF[8]
            mcf_prop_tax_shield = MCF[9]
            mcf_insurance = MCF[10]
            mcf_maintenance = MCF[11]
            mcf_hoa_dues = MCF[12]
            mcf_unlv_own_cf = MCF[13]
            mcf_unlv_net_cf = MCF[14]
            mcfl_loan_proc = MCF[15]
            mcfl_loan_repay = MCF[16]
            mcfl_amort = MCF[17]
            mcfl_loan_points = MCF[18]
            mcfl_interest = MCF[19]
            mcfl_interest_tax_shield = MCF[20]
            mcfl_mortgage_insurance = MCF[21]
            mcfl_lv_own_cf = MCF[22]
            mcfl_lv_net_cf = MCF[23]
            mcfl_lv_ge = MCF[24]
            mcfl_lv_ne = MCF[25]
            mcfl_total_interest = MCF[26]
            mortgage_insurance_payment = mcfl_mortgage_insurance[1]
            amortization = np.sum([mcfl_amort[1:13]])

            initial_equity_NOR = mcfl_lv_net_cf[0]
            initial_equity_GROSS = mcfl_lv_own_cf[0]
            max_equity_NOR = -np.min([mcfl_lv_ne])
            max_equity_GROSS = -np.min([mcfl_lv_ge])
            profit_NOR = np.sum([mcfl_lv_net_cf])
            profit_GROSS = np.sum([mcfl_lv_own_cf])

            today = date.today()
            dates = []
            for i in range(hold_period_m+1):
                next_month = today + relativedelta(months = i)
                next_date = date(next_month.year, next_month.month, next_month.day)
                dates.append(next_date)
            #print(len(mcf_unlv_net_cf))
            #print(len(mcf_unlv_own_cf))
            #print(dates)

            unlv_irr_NOR = xirr(mcf_unlv_net_cf, dates)*100 #0.076
            unlv_irr_GROSS = xirr(mcf_unlv_own_cf, dates)*100 #-0.07
            lv_irr_NOR = xirr(mcfl_lv_net_cf, dates)*100 #0.155
            lv_irr_GROSS = xirr(mcfl_lv_own_cf, dates)*100 #-0.144
            lv_em_NOR = -np.sum(mcfl_lv_net_cf)/(np.min(mcfl_lv_ne))+1 #1.91
            lv_em_GROSS = -np.sum(mcfl_lv_own_cf)/(np.min(mcfl_lv_ge))+1 #0.60

            ACF = gen_acf(hold_period, hold_period_m, mcf_rent, mcf_rent_insur, mcf_acquis, mcf_acquis_costs, mcf_sale, 
                                mcf_dispo_costs, mcf_prop_tax, mcf_prop_tax_shield, mcf_insurance, mcf_maintenance, mcf_hoa_dues,
                                loan_ltv_desired, mcfl_loan_repay, mortgage_points, mcfl_amort, mcfl_interest, mcfl_interest_tax_shield,
                                mcfl_mortgage_insurance)

            acf_html = ACF[0]
            acf_rent = ACF[1]
            acf_rent_insur = ACF[2]
            acf_rent_cashflow = ACF[3] 
            acf_acquis = ACF[4]
            acf_acquis_costs = ACF[5]
            acf_sale = ACF[6]
            acf_dispo_costs = ACF[7]
            acf_prop_tax = ACF[7]
            acf_prop_tax_shield = ACF[8]
            acf_insurance = ACF[9]
            acf_maintenance = ACF[10]
            acf_hoa_dues = ACF[11]
            acf_unlv_own_cf = ACF[12]
            acf_unlv_net_cf = ACF[13]
            acfl_loan_proc = ACF[14]
            acfl_loan_repay = ACF[15]
            acfl_amort = ACF[16]
            acfl_loan_points = ACF[17]
            acfl_interest = ACF[18]
            acfl_interest_tax_shield = ACF[19]
            acfl_mortgage_insurance = ACF[20]
            acfl_lv_own_cf = ACF[21]
            acfl_lv_net_cf = ACF[22]
            acfl_lv_ge = ACF[23]
            acfl_lv_ne = ACF[24]
            acf_unlv_own_cashflow_total = ACF[25]
            acf_rent_total = ACF[26]
            acf_rent_insur_total = ACF[27]
            acf_rent_cashflow_total = ACF[28]

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
                '''
                datafield.mcf_table = mcf_table
                datafield.total_rcf = total_rcf
                datafield.mcfu_table = mcfu_table
                datafield.gross_sale_30y = gross_sale_30y
                datafield.total_uocf = total_uocf
                datafield.mcfl_table = mcfl_table
                datafield.total_locf = total_locf
                datafield.mcfr_table = mcfr_table
                '''
                datafield.MCF = mcf_html
                datafield.ACF = acf_html
                datafield.total_interest = -mcfl_total_interest
                datafield.mortgage_insurance_payment = mortgage_insurance_payment
                datafield.amortization = -amortization

                datafield.initial_equity_NOR = -initial_equity_NOR
                datafield.initial_equity_GROSS = -initial_equity_GROSS
                datafield.max_equity_NOR = max_equity_NOR
                datafield.max_equity_GROSS = max_equity_GROSS
                datafield.profit_NOR = profit_NOR
                datafield.profit_GROSS = profit_GROSS
                datafield.unlv_irr_NOR = unlv_irr_NOR
                datafield.unlv_irr_GROSS = unlv_irr_GROSS
                datafield.lv_irr_NOR = lv_irr_NOR
                datafield.lv_irr_GROSS = lv_irr_GROSS
                datafield.lv_em_NOR = lv_em_NOR
                datafield.lv_em_GROSS = lv_em_GROSS

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
                                      mortgage_points=mortgage_points, MCF=mcf_html, ACF=acf_html, total_interest=mcfl_total_interest,
                                      mortgage_insurance_payment = mortgage_insurance_payment, amortization=amortization,
                                      initial_equity_NOR=initial_equity_NOR, initial_equity_GROSS=initial_equity_GROSS, 
                                      max_equity_NOR=max_equity_NOR, max_equity_GROSS=max_equity_GROSS, profit_NOR=profit_NOR,
                                      profit_GROSS=profit_GROSS, unlv_irr_NOR=unlv_irr_NOR, unlv_irr_GROSS=unlv_irr_GROSS,
                                      lv_irr_NOR=lv_irr_NOR, lv_irr_GROSS=lv_irr_GROSS, lv_em_NOR=lv_em_NOR, lv_em_GROSS=lv_em_GROSS)
                datafield.save()
                return Response(DataFieldSerializer(datafield).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
