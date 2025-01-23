using RentToOwn.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;

namespace RentToOwn.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QueryController : ControllerBase
    {
        private readonly ILogger<QueryController> _logger;

        private IConfiguration _configuration;
        private readonly string connString;
        private readonly IWebHostEnvironment _env;

        public QueryController(ILogger<QueryController> logger, IConfiguration configuration, IWebHostEnvironment env)
        {
            _logger = logger;
            _configuration = configuration;
            _env = env;
            connString = _configuration.GetConnectionString("RVO_TestCon");
        }

        [HttpPost]
        [Route("PostQuery")]
        /*[Consumes("application/json")]*/
        public IActionResult AddQuery([FromBody] Query query) {
            string sql = @"
                INSERT INTO queries (
                    user_id, price, holding_y, holding_m, rent_m, parking_m, rent_insur_m, total_rent,
                    cap_gains_rate, federal_tax_rate, federal_tax_bool, salt_limit, salt_limit_bool,
                    rent_growth, home_price_appr, ret_inflation, other_inflation,
                    inspection, appraisal, legal_fees, title_insur_acq, title_insur_acq_rate, other_lender_costs,
                    transfer_tax_acq, transfer_tax_acq_rate, total_acquisition, title_insur_disp,
                    transfer_tax_disp, transfer_tax_disp_rate, broker_fee, broker_rate, total_disposition,
                    property_tax, property_tax_rate, home_insurance, home_insurance_rate, maintenance, 
                    maintenance_rate, hoa_util, hoa_util_rate, max_loan_ltv, max_loan_rate, desired_loan_ltv, 
                    desired_loan_rate, loan_rate, loan_amortization, mortgage_insur_rate, mortgage_insur_limit,
                    mortgage_points, mortgage_points_rate
                )
                VALUES (
                    @user_id, @price, @holding_y, @holding_m, @rent_m, @parking_m, @rent_insur_m, @total_rent,
                    @cap_gains_rate, @federal_tax_rate, @federal_tax_bool, @salt_limit, @salt_limit_bool,
                    @rent_growth, @home_price_appr, @ret_inflation, @other_inflation,
                    @inspection, @appraisal, @legal_fees, @title_insur_acq, @title_insur_acq_rate, @other_lender_costs,
                    @transfer_tax_acq, @transfer_tax_acq_rate, @total_acquisition, @title_insur_disp,
                    @transfer_tax_disp, @transfer_tax_disp_rate, @broker_fee, @broker_rate, @total_disposition,
                    @property_tax, @property_tax_rate, @home_insurance, @home_insurance_rate, @maintenance, 
                    @maintenance_rate, @hoa_util, @hoa_util_rate, @max_loan_ltv, @max_loan_rate, @desired_loan_ltv, 
                    @desired_loan_rate, @loan_rate, @loan_amortization, @mortgage_insur_rate, @mortgage_insur_limit,
                    @mortgage_points, @mortgage_points_rate
                );";

            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@user_id", query.user_id);
                        cmd.Parameters.AddWithValue("@price", query.price);
                        cmd.Parameters.AddWithValue("@holding_y", query.holding_y);
                        cmd.Parameters.AddWithValue("@holding_m", query.holding_m);

                        cmd.Parameters.AddWithValue("@rent_m", query.rent_m);
                        cmd.Parameters.AddWithValue("@parking_m", query.parking_m);
                        cmd.Parameters.AddWithValue("@rent_insur_m", query.rent_insur_m);
                        cmd.Parameters.AddWithValue("@total_rent", query.total_rent);

                        cmd.Parameters.AddWithValue("@cap_gains_rate", query.cap_gains_rate);
                        cmd.Parameters.AddWithValue("@federal_tax_rate", query.federal_tax_rate);
                        cmd.Parameters.AddWithValue("@federal_tax_bool", query.federal_tax_bool);
                        cmd.Parameters.AddWithValue("@salt_limit", query.salt_limit);
                        cmd.Parameters.AddWithValue("@salt_limit_bool", query.salt_limit_bool);
                        cmd.Parameters.AddWithValue("@rent_growth", query.rent_growth);
                        cmd.Parameters.AddWithValue("@home_price_appr", query.home_price_appr);
                        cmd.Parameters.AddWithValue("@ret_inflation", query.ret_inflation);
                        cmd.Parameters.AddWithValue("@other_inflation", query.other_inflation);

                        cmd.Parameters.AddWithValue("@inspection", query.inspection);
                        cmd.Parameters.AddWithValue("@appraisal", query.appraisal);
                        cmd.Parameters.AddWithValue("@legal_fees", query.legal_fees);
                        cmd.Parameters.AddWithValue("@title_insur_acq", query.title_insur_acq);
                        cmd.Parameters.AddWithValue("@title_insur_acq_rate", query.title_insur_acq_rate);
                        cmd.Parameters.AddWithValue("@other_lender_costs", query.other_lender_costs);
                        cmd.Parameters.AddWithValue("@transfer_tax_acq", query.transfer_tax_acq);
                        cmd.Parameters.AddWithValue("@transfer_tax_acq_rate", query.transfer_tax_acq_rate);
                        cmd.Parameters.AddWithValue("@total_acquisition", query.total_acquisition);

                        cmd.Parameters.AddWithValue("@title_insur_disp", query.title_insur_disp);
                        cmd.Parameters.AddWithValue("@transfer_tax_disp", query.transfer_tax_disp);
                        cmd.Parameters.AddWithValue("@transfer_tax_disp_rate", query.transfer_tax_disp_rate);
                        cmd.Parameters.AddWithValue("@broker_fee", query.broker_fee);
                        cmd.Parameters.AddWithValue("@broker_rate", query.broker_rate);
                        cmd.Parameters.AddWithValue("@total_disposition", query.total_disposition);

                        cmd.Parameters.AddWithValue("@property_tax", query.property_tax);
                        cmd.Parameters.AddWithValue("@property_tax_rate", query.property_tax_rate);
                        cmd.Parameters.AddWithValue("@home_insurance", query.home_insurance);
                        cmd.Parameters.AddWithValue("@home_insurance_rate", query.home_insurance_rate);
                        cmd.Parameters.AddWithValue("@maintenance", query.maintenance);
                        cmd.Parameters.AddWithValue("@maintenance_rate", query.maintenance_rate);
                        cmd.Parameters.AddWithValue("@hoa_util", query.hoa_util);
                        cmd.Parameters.AddWithValue("@hoa_util_rate", query.hoa_util_rate);

                        cmd.Parameters.AddWithValue("@max_loan_ltv", query.max_loan_ltv);
                        cmd.Parameters.AddWithValue("@max_loan_rate", query.max_loan_rate);
                        cmd.Parameters.AddWithValue("@desired_loan_ltv", query.desired_loan_ltv);
                        cmd.Parameters.AddWithValue("@desired_loan_rate", query.desired_loan_rate);
                        cmd.Parameters.AddWithValue("@loan_rate", query.loan_rate);
                        cmd.Parameters.AddWithValue("@loan_amortization", query.loan_amortization);
                        cmd.Parameters.AddWithValue("@mortgage_insur_rate", query.mortgage_insur_rate);
                        cmd.Parameters.AddWithValue("@mortgage_insur_limit", query.mortgage_insur_limit);
                        cmd.Parameters.AddWithValue("@mortgage_points", query.mortgage_points);
                        cmd.Parameters.AddWithValue("@mortgage_points_rate", query.mortgage_points_rate);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                string pyExe = "C:/Users/camer/AppData/Local/Microsoft/WindowsApps/PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0/python.exe";
                string script = "C:/Users/camer/Desktop/Apps/RentToOwnCalculator/renttoown.client/src/scripts/table_gen.py";
                string queryJSON = JsonSerializer.Serialize(query);

                System.Diagnostics.Debug.WriteLine("Query JSON: " + queryJSON);
                queryJSON = queryJSON.Replace("\"", "\\\"");

                ProcessStartInfo start = new ProcessStartInfo
                {
                    FileName = pyExe,
                    //Arguments = script,
                    Arguments = $"\"{script}\" --query \"{queryJSON}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                };
                using (Process process = Process.Start(start))
                {
                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();

                    System.Diagnostics.Debug.WriteLine("Output: " + output);
                    System.Diagnostics.Debug.WriteLine("Error: " + error);

                    if (string.IsNullOrEmpty(output))
                    {
                        System.Diagnostics.Debug.WriteLine("No output from Python script.");
                        return StatusCode(500, "No output from Python script.");
                    }

                    try
                    {
                        var result = JsonSerializer.Deserialize<Dictionary<string, object>>(output);
                        System.Diagnostics.Debug.WriteLine("Deserialized Result: " + result);
                        return Ok(result);
                    }
                    catch (JsonException ex) 
                    {
                        System.Diagnostics.Debug.WriteLine("Deserialization Error: " + ex.Message);
                        return StatusCode(500, "Failed to deserialize Python script output.");
                    }
                }

                //return Ok("Query added successfully.");
                
            }
            catch (Exception ex)
            { 
                return StatusCode(500, "Internal server error: " +  ex.Message);
            }
        }

        [HttpGet]
        [Route("GetQuery")]
        public IActionResult GetQuery(string UserId) {
            List<Query> queryList = new List<Query>();

            string sql = "SELECT * FROM queries WHERE user_id = @UserId";

            using (SqlConnection conn = new SqlConnection(connString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", UserId);

                    try
                    {
                        conn.Open();

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var query = new Query
                                {
                                    user_id = (string)reader["user_id"],
                                    price = Convert.ToDecimal(reader["price"]),
                                    holding_y = Convert.ToInt32(reader["holding_y"]),
                                    holding_m = Convert.ToInt32(reader["holding_m"]),

                                    rent_m = Convert.ToDecimal(reader["rent_m"]),
                                    parking_m = Convert.ToDecimal(reader["parking_m"]),
                                    rent_insur_m = Convert.ToDecimal(reader["rent_insur_m"]),
                                    total_rent = Convert.ToDecimal(reader["total_rent"]),

                                    cap_gains_rate = Convert.ToDecimal(reader["cap_gains_rate"]),
                                    federal_tax_rate = Convert.ToDecimal(reader["federal_tax_rate"]),
                                    federal_tax_bool = (bool)reader["federal_tax_bool"],
                                    salt_limit = Convert.ToInt32(reader["salt_limit"]),
                                    salt_limit_bool = (bool)reader["salt_limit_bool"],
                                    rent_growth = Convert.ToDecimal(reader["rent_growth"]),
                                    home_price_appr = Convert.ToDecimal(reader["home_price_appr"]),
                                    ret_inflation = Convert.ToDecimal(reader["ret_inflation"]),
                                    other_inflation = Convert.ToDecimal(reader["other_inflation"]),

                                    inspection = Convert.ToInt32(reader["inspection"]),
                                    appraisal = Convert.ToInt32(reader["appraisal"]),
                                    legal_fees = Convert.ToInt32(reader["legal_fees"]),
                                    title_insur_acq = Convert.ToInt32(reader["title_insur_acq"]),
                                    title_insur_acq_rate = Convert.ToDecimal(reader["title_insur_acq_rate"]),
                                    other_lender_costs = Convert.ToInt32(reader["other_lender_costs"]),
                                    transfer_tax_acq = Convert.ToInt32(reader["transfer_tax_acq"]),
                                    transfer_tax_acq_rate = Convert.ToDecimal(reader["transfer_tax_acq_rate"]),
                                    total_acquisition = Convert.ToInt32(reader["total_acquisition"]),

                                    title_insur_disp = Convert.ToInt32(reader["title_insur_disp"]),
                                    transfer_tax_disp = Convert.ToInt32(reader["transfer_tax_disp"]),
                                    transfer_tax_disp_rate = Convert.ToDecimal(reader["transfer_tax_disp_rate"]),
                                    broker_fee = Convert.ToInt32(reader["broker_fee"]),
                                    broker_rate = Convert.ToDecimal(reader["broker_rate"]),
                                    total_disposition = Convert.ToInt32(reader["total_disposition"]),

                                    property_tax = Convert.ToInt32(reader["property_tax"]),
                                    property_tax_rate = Convert.ToDecimal(reader["property_tax_rate"]),
                                    home_insurance = Convert.ToInt32(reader["home_insurance"]),
                                    home_insurance_rate = Convert.ToDecimal(reader["home_insurance_rate"]),
                                    maintenance = Convert.ToInt32(reader["maintenance"]),
                                    maintenance_rate = Convert.ToDecimal(reader["maintenance_rate"]),
                                    hoa_util = Convert.ToInt32(reader["hoa_util"]),
                                    hoa_util_rate = Convert.ToDecimal(reader["hoa_util_rate"]),

                                    max_loan_ltv = Convert.ToInt32(reader["max_loan_ltv"]),
                                    max_loan_rate = Convert.ToDecimal(reader["max_loan_rate"]),
                                    desired_loan_ltv = Convert.ToInt32(reader["desired_loan_ltv"]),
                                    desired_loan_rate = Convert.ToDecimal(reader["desired_loan_rate"]),
                                    loan_rate = Convert.ToDecimal(reader["loan_rate"]),
                                    loan_amortization = Convert.ToInt32(reader["loan_amortization"]),
                                    mortgage_insur_rate = Convert.ToDecimal(reader["mortgage_insur_rate"]),
                                    mortgage_insur_limit = Convert.ToInt32(reader["mortgage_insur_limit"]),
                                    mortgage_points = Convert.ToInt32(reader["mortgage_points"]),
                                    mortgage_points_rate = Convert.ToDecimal(reader["mortgage_points_rate"])
                                };

                                queryList.Add(query);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error retrieving results for UserId {UserId}: {ex.Message}");
                        return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
                    }
                }
            }

            if (queryList.Count > 0)
            {
                return Ok(queryList);
            }
            else
            {
                return NotFound($"No results found for UserId {UserId}");
            }
        }
    }
}
