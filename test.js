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
        df = pd.read_excel(excel_file)
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
        
        # Get legal entity ID - can be null
        legal_entity_id = row.get('LE ID')
        if pd.isna(legal_entity_id):
            logger.warning(f"Row {row_num}: LE ID is null")
            legal_entity_id = None
        
        # Normalize all text fields by trimming whitespace and lowercasing for comparison
        def normalize_cell(val):
            if pd.isna(val):
                return None
            if not isinstance(val, str):
                return val
            return val.strip().lower()
        
        # Apply normalization to the entire row for consistent comparisons
        normalized_row = {k: normalize_cell(v) for k, v in row.items()}
        
        # Determine conveyed status - check different column names and values
        settled_conveyed_col = next((col for col in ['Settled/Conveyed MOP', 'Settled/Conveyed'] if col in row), None)
        is_conveyed = False
        
        if settled_conveyed_col:
            settled_conveyed_value = normalized_row.get(settled_conveyed_col)
            if settled_conveyed_value is None or settled_conveyed_value in ["n/a", "na", "no", "null"]:
                logger.info(f"Row {row_num}: Settled/Conveyed value is null/N/A/No")
            elif isinstance(settled_conveyed_value, str) and re.search(r'convey', settled_conveyed_value):
                is_conveyed = True
                logger.info(f"Row {row_num}: Detected conveyed status from value '{settled_conveyed_value}'")
        
        # Get funding config - handle both hardcoded values and derived values
        funding_config_id = None
        
        # First check if there's already a hardcoded funding config value
        if 'fundingConfig' in row and pd.notna(row.get('fundingConfig')):
            try:
                # Handle numbers that might be formatted as strings or in different parts of the cell
                funding_config_str = str(row.get('fundingConfig')).strip()
                funding_config_id = int(re.search(r'\d+', funding_config_str).group())
                logger.info(f"Row {row_num}: Using hardcoded funding config ID {funding_config_id}")
            except (ValueError, TypeError, AttributeError):
                logger.warning(f"Row {row_num}: Invalid hardcoded funding config value: {row.get('fundingConfig')}")
        
        # If no hardcoded value, derive from Funding Hub Configuration and conveyed status
        if funding_config_id is None:
            # Get funding hub value (normalized)
            funding_hub_value = normalized_row.get('Funding Hub Configuration')
            
            if is_conveyed:
                # Any conveyed maps to ID 3
                funding_config_id = 3
                logger.info(f"Row {row_num}: Using funding config ID 3 (conveyed)")
            elif funding_hub_value is not None:
                if "fund hub" in funding_hub_value:
                    funding_config_id = 1
                    logger.info(f"Row {row_num}: Using funding config ID 1 (Fund Hub settled)")
                elif any(settlement in funding_hub_value for settlement in ["it_settlement", "it settlement", "it_settlement"]):
                    funding_config_id = 2
                    logger.info(f"Row {row_num}: Using funding config ID 2 (IT Settlement)")
            
            # If both methods fail, check the hardcoded value in column
            if funding_config_id is None and "Funding Hub" in row:
                hardcoded_value = row.get("Funding Hub")
                if pd.notna(hardcoded_value):
                    try:
                        # Extract digits from any string or value
                        hardcoded_str = str(hardcoded_value).strip()
                        match = re.search(r'\d+', hardcoded_str)
                        if match:
                            funding_config_id = int(match.group())
                            logger.info(f"Row {row_num}: Using extracted funding config ID: {funding_config_id}")
                    except (ValueError, TypeError):
                        pass
        
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
        
        # Create config with robust handling of all fields
        config = {
            "methodOfPayment": str(mop_code),
            "legalEntity": str(legal_entity_id) if pd.notna(legal_entity_id) else None,
            "fundingConfig": funding_config_id,
            "settlementService": parse_string(row.get('Settlement Services(ISS/NSS)')),
            "ndxDisputes": parse_bool(normalized_row.get('Non Delivery Disputes (NDX) applicable for MOP')),
            "chargebackDisputes": parse_bool(normalized_row.get('Chargeback Disputes applicable on MOP')),
            "settlementWindow": parse_number(row.get('Settlement Window Applicable Indicator')),
            "settlementWindowApplicableIndicator": parse_bool(normalized_row.get('Settlement Window Applicable Indicator')),
            "riskReportableIndicator": parse_bool(normalized_row.get('Risk Reportable')),
            "chargebackReportableIndicator": parse_bool(normalized_row.get('Chargeback Reportable')),
            "salesReportableIndicator": parse_bool(normalized_row.get('Sales Reportable')),
            "refundReportableIndicator": parse_bool(normalized_row.get('Refund Reportable')),
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
