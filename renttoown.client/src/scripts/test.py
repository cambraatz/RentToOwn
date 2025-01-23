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

def main(query):
    print(sys.executable)
    print("Hello World!")
    
    # Convert the JSON string back to a dictionary
    query_dict = json.loads(query)
    
    for key, value in query_dict.items():
        print(f"{key}: {value}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process query parameters.")
    parser.add_argument("--query", type=str, required=True, help="JSON string representing the query parameter.")

    args = parser.parse_args()

    main(args.query)
