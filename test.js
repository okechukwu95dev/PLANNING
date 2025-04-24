import pandas as pd
import json
import logging
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("processing.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger()

def create_credit_exposure_configs(excel_file, output_file):
    """Create Credit Exposure Configuration JSON from Excel data"""
    logger.info(f"Starting to process Excel file: {excel_file}")
    
    try:
        # Force string type for LE ID to prevent float conversion
        df = pd.read_excel(excel_file, dtype={'LE ID': str, 'MOP Code': str})
        logger.info(f"Successfully loaded Excel file with {len(df)} rows")
    except Exception as e:
        logger.error(f"Failed to load Excel file: {str(e)}")
        return []
    
    configs = []
    
    for idx, row in df.iterrows():
        row_num = idx + 2  # Excel row number (1-based + header)
        
        # Check for MOP Code - only required field
        mop_code = row.get('MOP Code')
        if pd.isna(mop_code):
            logger.warning(f"Skipping row {row_num} - Missing MOP Code")
            continue
        
        logger.info(f"Processing row {row_num}: MOP {mop_code}")
        
        # Get legal entity ID - keep as string without decimal
        legal_entity_id = row.get('LE ID')
        if pd.isna(legal_entity_id):
            logger.warning(f"Row {row_num}: LE ID is null")
            legal_entity_id = None
        else:
            # Remove any decimal part if it exists
            legal_entity_id = str(legal_entity_id).split('.')[0]
        
        # Normalize all text fields by trimming whitespace and lowercasing for comparison
        def normalize_cell(val):
            if pd.isna(val):
                return None
            if not isinstance(val, str):
                return str(val).lower()
            return val.strip().lower()
        
        # Apply normalization to the entire row for consistent comparisons
        normalized_row = {k: normalize_cell(v) for k, v in row.items()}
        
        # Determine conveyed status - check different column names and values with more aggressive matching
        is_conveyed = False
        
        # Try all possible column names that might contain conveyed info
        conveyed_columns = ['Settled/Conveyed MOP', 'Settled/Conveyed', 'Settled/Conveyed MOP', 'Conveyed']
        
        for col in conveyed_columns:
            if col in row:
                value = normalized_row.get(col)
                if value and 'convey' in value:
                    is_conveyed = True
                    logger.info(f"Row {row_num}: Detected conveyed status from column {col} with value '{value}'")
                    break
        
        # Extra check - look for 'conveyed' in any column value as a fallback
        if not is_conveyed:
            for col, value in normalized_row.items():
                if value and isinstance(value, str) and 'convey' in value:
                    is_conveyed = True
                    logger.info(f"Row {row_num}: Detected conveyed status from column {col} with value '{value}'")
                    break
        
        # Get funding config - handle both hardcoded values and derived values
        funding_config_id = None
        
        # Check hardcoded values in the Funding Hub column
        funding_hub_columns = ['Funding Hub Configuration', 'Funding Hub']
        for col in funding_hub_columns:
            if col in row and pd.notna(row[col]):
                value = row[col]
                if isinstance(value, (int, float)) and not pd.isna(value):
                    # Direct integer value
                    funding_config_id = int(value)
                    logger.info(f"Row {row_num}: Found direct funding config ID {funding_config_id} in column {col}")
                    break
        
        # If no hardcoded ID found, derive from Funding Hub value and conveyed status
        if funding_config_id is None:
            # Get funding hub value (normalized)
            for col in funding_hub_columns:
                if col in normalized_row and normalized_row[col]:
                    funding_hub_value = normalized_row[col]
                    
                    if is_conveyed:
                        # Any conveyed maps to ID 3
                        funding_config_id = 3
                        logger.info(f"Row {row_num}: Using funding config ID 3 (conveyed)")
                    elif "fund hub" in funding_hub_value:
                        funding_config_id = 1
                        logger.info(f"Row {row_num}: Using funding config ID 1 (Fund Hub settled)")
                    elif any(settlement in funding_hub_value for settlement in ["it_settlement", "it settlement", "it_settlement"]):
                        funding_config_id = 2
                        logger.info(f"Row {row_num}: Using funding config ID 2 (IT Settlement)")
                    break
        
        # Create parsers for different data types with robust handling
        def parse_bool(val):
            if pd.isna(val) or val in ["n/a", "na", "null", "none", ""]:
                return None
            if isinstance(val, bool):
                return val
            if isinstance(val, str):
                val = val.strip().upper()
                return val == 'Y' or val == 'YES' or val == 'TRUE'
            return None
        
        def parse_number(val):
            if pd.isna(val) or val in ["n/a", "na", "null", "none", ""]:
                return None
            try:
                if isinstance(val, str):
                    # Extract digits from any string
                    match = re.search(r'\d+', val.strip())
                    if match:
                        return int(match.group())
                return int(val)
            except (ValueError, TypeError):
                return None
        
        def parse_string(val):
            if pd.isna(val) or val in ["n/a", "na", "null", "none", ""]:
                return None
            return str(val).strip()
        
        # Check multiple possible column names for settlement window
        settlement_window = None
        window_columns = [
            'Settlement Window', 
            'Settlement Window or Network funding',
            'Settlement Network funding'
        ]
        
        for col in window_columns:
            if col in row and pd.notna(row[col]):
                settlement_window = parse_number(row[col])
                if settlement_window is not None:
                    logger.info(f"Row {row_num}: Found settlement window {settlement_window} in column {col}")
                    break
        
        # Create config with robust handling of all fields
        config = {
            "methodOfPayment": str(mop_code),
            "legalEntity": legal_entity_id,
            "fundingConfig": funding_config_id,
            "settlementService": parse_string(row.get('Settlement Services(ISS/NSS)')),
            "ndxDisputes": parse_bool(row.get('Non Delivery Disputes (NDX) applicable for MOP')),
            "chargebackDisputes": parse_bool(row.get('Chargeback Disputes applicable on MOP')),
            "settlementWindow": settlement_window,
            "settlementWindowApplicableIndicator": parse_bool(row.get('Settlement Window Applicable Indicator')),
            "riskReportableIndicator": parse_bool(row.get('Risk Reportable')),
            "chargebackReportableIndicator": parse_bool(row.get('Chargeback Reportable')),
            "salesReportableIndicator": parse_bool(row.get('Sales Reportable')),
            "refundReportableIndicator": parse_bool(row.get('Refund Reportable')),
            "salesExposureIndicator": True,
            "refundExposureIndicator": True,
            "chargebackExposureIndicator": True
        }
        
        logger.info(f"Created config for {mop_code}")
        configs.append(config)
    
    # Write to JSON file
    try:
        with open(output_file, 'w') as f:
            json.dump(configs, f, indent=2)
        logger.info(f"Successfully wrote {len(configs)} configurations to {output_file}")
    except Exception as e:
        logger.error(f"Failed to write JSON file: {str(e)}")
    
    return configs

if __name__ == "__main__":
    excel_file = "workbook.xlsx"  # Your file name
    output_file = "credit_exposure_configs.json"
    
    configs = create_credit_exposure_configs(excel_file, output_file)
    
    if configs:
        print(f"\nCreated {len(configs)} Credit Exposure Configurations.")
        print(f"Check processing.log for detailed processing information.")
        
        print("\nSample config:")
        print(json.dumps(configs[0], indent=2))
