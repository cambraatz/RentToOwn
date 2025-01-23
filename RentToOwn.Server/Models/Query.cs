using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentToOwn.Server.Models
{
    public class Query
    {
        public string user_id { get; set; }
        public decimal price { get; set; }
        public int holding_y { get; set; }
        public int holding_m { get; set; }

        public decimal rent_m { get; set; }
        public decimal parking_m { get; set; }
        public decimal rent_insur_m { get; set; }
        public decimal total_rent { get; set; }

        public decimal cap_gains_rate { get; set; }
        public decimal federal_tax_rate { get; set; }
        public bool federal_tax_bool { get; set; }
        public decimal salt_limit { get; set; }
        public bool salt_limit_bool { get; set; }
        public decimal rent_growth { get; set; }
        public decimal home_price_appr { get; set; }
        public decimal ret_inflation { get; set; }
        public decimal other_inflation { get; set; }

        public decimal inspection { get; set; }
        public decimal appraisal { get; set; }
        public decimal legal_fees { get; set; }
        public decimal title_insur_acq { get; set; }
        public decimal title_insur_acq_rate { get; set; }
        public decimal other_lender_costs { get; set; }
        public decimal transfer_tax_acq { get; set; }
        public decimal transfer_tax_acq_rate { get; set; }
        public decimal total_acquisition { get; set; }

        public decimal title_insur_disp { get; set; }
        public decimal transfer_tax_disp { get; set; }
        public decimal transfer_tax_disp_rate { get; set; }
        public decimal broker_fee { get; set; }
        public decimal broker_rate { get; set; }
        public decimal total_disposition { get; set; }

        public decimal property_tax { get; set; }
        public decimal property_tax_rate { get; set; }
        public decimal home_insurance { get; set; }
        public decimal home_insurance_rate { get; set; }
        public decimal maintenance { get; set; }
        public decimal maintenance_rate { get; set; }
        public decimal hoa_util { get; set; }
        public decimal hoa_util_rate { get; set; }

        public decimal max_loan_ltv { get; set; }
        public decimal max_loan_rate { get; set; }
        public decimal desired_loan_ltv { get; set; }
        public decimal desired_loan_rate { get; set; }
        public decimal loan_rate { get; set; }
        public int loan_amortization { get; set; }
        public decimal mortgage_insur_rate { get; set; }
        public decimal mortgage_insur_limit { get; set; }
        public decimal mortgage_points { get; set; }
        public decimal mortgage_points_rate { get; set; }
    }
}
/*
{
    public class Query
    {
        // Primary Key and Foreign Key
        [Key]
        //[ForeignKey("User")]
        [StringLength(255)]
        public string UserId { get; set; }

        // Fields corresponding to SQL table columns
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }

        public int HoldingY { get; set; }
        public int HoldingM { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal RentM { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal ParkingM { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal RentInsurM { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalRent { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal CapGainsRate { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal FederalTaxRate { get; set; }

        public bool FederalTaxBool { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal SaltLimit { get; set; }

        public bool SaltLimitBool { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal RentGrowth { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal HomePriceAppr { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal RetInflation { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal OtherInflation { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Inspection { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Appraisal { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal LegalFees { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TitleInsurAcq { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal TitleInsurAcqRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal OtherLenderCosts { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TransferTaxAcq { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal TransferTaxAcqRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAcquisition { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TitleInsurDisp { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TransferTaxDisp { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal TransferTaxDispRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal BrokerFee { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal BrokerRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalDisposition { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PropertyTax { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal PropertyTaxRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal HomeInsurance { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal HomeInsuranceRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Maintenance { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal MaintenanceRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal HoaUtil { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal HoaUtilRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal MaxLoanLtv { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal MaxLoanRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal DesiredLoanLtv { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal DesiredLoanRate { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal LoanRate { get; set; }

        public int LoanAmortization { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal MortgageInsurRate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal MortgageInsurLimit { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal MortgagePoints { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal MortgagePointsRate { get; set; }

        // Relationship with the User table???
        //public virtual User User { get; set; }
    }
}*/
