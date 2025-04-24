import pandas as pd
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

def create_credit_exposure_configs(excel_file, output_file):
    """Create Credit Exposure Configuration JSON from Excel data"""
    logger.info(f"Processing Excel file: {excel_file}")
    
    try:
        df = pd.read_excel(excel_file)
        logger.info(f"Loaded {len(df)} rows from Excel")
    except Exception as e:
        logger.error(f"Failed to load Excel: {str(e)}")
        return []
    
    configs = []
    
    for idx, row in df.iterrows():
        row_num = idx + 2  # Excel row number (1-based + header)
        logger.info(f"Processing row {row_num}")
        
        # Skip rows without MOP Code (this is the only required field)
        if pd.isna(row.get('MOP Code')):
            logger.warning(f"Skipping row {row_num} - Missing MOP Code")
            continue
            
        mop_code = row.get('MOP Code')
        legal_entity_id = row.get('LE ID')
        logger.info(f"Processing MOP: {mop_code}, LE: {legal_entity_id}")
        
        # Handle settled/conveyed - check for both possible column names
        settled_conveyed_col = 'Settled/Conveyed MOP' if 'Settled/Conveyed MOP' in row else 'Settled/Conveyed'
        settled_conveyed_value = row.get(settled_conveyed_col)
        
        # Determine if conveyed (any variation) - handle null case
        is_conveyed = False
        if pd.isna(settled_conveyed_value):
            logger.info(f"Row {row_num}: Settled/Conveyed value is null")
        elif isinstance(settled_conveyed_value, str) and "conveyed" in settled_conveyed_value.lower():
            is_conveyed = True
            logger.info(f"Row {row_num}: Detected conveyed status from value '{settled_conveyed_value}'")
        
        # Get funding hub value - handle null case
        funding_hub_value = row.get('Funding Hub Configuration')
        if pd.isna(funding_hub_value):
            logger.info(f"Row {row_num}: Funding Hub Configuration is null")
        
        # Determine funding config ID
        funding_config_id = None
        if is_conveyed:
            # Any conveyed value maps to funding config ID 3 (Fund Hub conveyed)
            funding_config_id = 3
            logger.info(f"Using funding config ID 3 (Fund Hub conveyed) for row {row_num}")
        elif pd.notna(funding_hub_value):
            if funding_hub_value == "Fund Hub":
                funding_config_id = 1
                logger.info(f"Using funding config ID 1 (Fund Hub settled) for row {row_num}")
            elif funding_hub_value in ["IT_settlement", "IT Settlement", "IT_Settlement"]:
                funding_config_id = 2
                logger.info(f"Using funding config ID 2 (IT Settlement) for row {row_num}")
            else:
                logger.warning(f"Row {row_num}: No matching funding config for '{funding_hub_value}' and conveyed={is_conveyed}")
        else:
            # Both funding hub and settled/conveyed are null
            logger.warning(f"Row {row_num}: Both funding hub and settled/conveyed are null, using null for fundingConfig")
        
        # Helper functions for parsing values
        def parse_bool(val):
            if pd.isna(val):
                return None
            return val == 'Y'
        
        def parse_number(val):
            if pd.isna(val):
                return None
            try:
                return int(val)
            except:
                return None
        
        # Create config object with proper null handling
        config = {
            "methodOfPayment": mop_code,
            "legalEntity": str(legal_entity_id) if pd.notna(legal_entity_id) else None,
            "fundingConfig": funding_config_id,
            "settlementService": row.get('Settlement Services(ISS/NSS)') if pd.notna(row.get('Settlement Services(ISS/NSS)')) else None,
            "ndxDisputes": parse_bool(row.get('Non Delivery Disputes (NDX) applicable for MOP')),
            "chargebackDisputes": parse_bool(row.get('Chargeback Disputes applicable on MOP')),
            "settlementWindow": parse_number(row.get('Settlement Window Applicable Indicator')),
            "settlementWindowApplicableIndicator": parse_bool(row.get('Settlement Window Applicable Indicator')),
            "riskReportableIndicator": parse_bool(row.get('Risk Reportable')),
            "chargebackReportableIndicator": parse_bool(row.get('Chargeback Reportable')),
            "salesReportableIndicator": parse_bool(row.get('Sales Reportable')),
            "refundReportableIndicator": parse_bool(row.get('Refund Reportable')),
            "salesExposureIndicator": True,
            "refundExposureIndicator": True,
            "chargebackExposureIndicator": True
        }
        
        # Remove None values if needed (comment out if you want to keep nulls)
        # config = {k: v for k, v in config.items() if v is not None}
        
        logger.info(f"Created config for {mop_code} with funding config {config['fundingConfig']}")
        configs.append(config)
    
    # Write to JSON file
    try:
        with open(output_file, 'w') as f:
            json.dump(configs, f, indent=2)
        logger.info(f"Wrote {len(configs)} configs to {output_file}")
    except Exception as e:
        logger.error(f"Failed to write to {output_file}: {str(e)}")
    
    return configs

if __name__ == "__main__":
    configs = create_credit_exposure_configs("payment_methods.xlsx", "credit_exposure_configs.json")
    print(f"Created {len(configs)} Credit Exposure Configurations")
    if configs:
        print("Sample config:")
        print(json.dumps(configs[0], indent=2))
