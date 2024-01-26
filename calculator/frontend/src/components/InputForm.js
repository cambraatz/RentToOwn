import React, { useState } from "react";
import InputManager from "./InputManager";


const Form = () => {
    const [formData, setFormData] = useState({
        purchasePrice: 500000,
        hold_period: 5,
        hold_period_m: 60,

        apartment_rent: 3000,
        parking_rent: 300,
        renters_insurance: 600,
        monthly_rent: 3300,

        rate_capital_gains: 20,
        rate_federal_tax: 35,
        bool_federal: true,
        salt_limit: 10000,
        bool_salt: true,
        rent_growth: 3,
        home_appreciation: 3,
        ret_inflation: 3,
        other_inflation: 3,

        fee_inspection: 1000,
        fee_appraisal: 750,
        fee_legal: 1500,
        rate_title_insurance_aq: 0.5,
        title_insurance_aq: 2500,
        lender_costs_other: 2000,
        rate_transfer_tax_aq: 0,
        transfer_tax_aq: 0,
        total_acquisition: 7750,

        rate_title_insurance_dis: 0,
        title_insurance_dis: 0,
        rate_transfer_tax_dis: 0,
        transfer_tax_dis: 0,
        rate_brokerage: 5.5,
        fee_brokerage: 31880,
        total_disposition: 31880,

        rate_property_tax: 0.6,
        property_tax: 3000,
        rate_home_insurance: 0.6,
        home_insurance: 3000,
        rate_home_maintenance: 1,
        home_maintenance: 5000,
        rate_hoa_util: 0.25,
        hoa_util: 104,
        
        rate_ltv_max: 80,
        loan_ltv_max: 787750,
        loan_ltv_desired: 400000,
        rate_ltv_desired: 80,
        rate_home_loan: 7,
        amort_home_loan: 30,
        rate_mortgage_insurance: 5,
        clear_mortgage_insurance: 80,
        rate_mortgage_points: 1,
        mortgage_points: 4000,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const jsonFormData = JSON.stringify(formData);
        alert(jsonFormData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputManager handleChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;