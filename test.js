import pandas as pd
import json
import logging

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
    
    # Get funding configuration mappings
    funding_config_mapping = {
        ("Fund Hub", False): 1,  # Fund Hub + Settled
        ("IT_settlement", False): 2,  # IT Settlement + Settled
        ("IT Settlement", False): 2,  # IT Settlement + Settled
        ("IT_Settlement", False): 2,  # IT Settlement + Settled
        ("Fund Hub", True): 3,   # Fund Hub + Conveyed
        ("conveyed", True): 3,   # Conveyed
        ("Conveyed", True): 3,   # Conveyed
    }
    
    configs = []
    
    for idx, row in df.iterrows():
        logger.info(f"Processing row {idx+2} (Excel row number)")
        
        # Skip rows without data
        if pd.isna(row.get('MOP Code')):
            logger.warning(f"Skipping row {idx+2} - Missing MOP Code")
            continue
            
        # Get MOP code and Legal Entity ID directly from columns
        mop_code = row.get('MOP Code')
        legal_entity_id = row.get('LE ID')
        
        logger.info(f"Processing MOP: {mop_code}, Legal Entity ID: {legal_entity_id}")
        
        if not mop_code or pd.isna(legal_entity_id):
            logger.warning(f"Skipping row {idx+2} - Invalid MOP Code or Legal Entity ID")
            continue
        
        # Helper functions for data conversion
        def parse_bool(val):
            if pd.isna(val):
                return None
            if val == 'N/A' or val == 'n/a':
                return None
            return val == 'Y'
        
        def parse_number(val):
            if pd.isna(val) or val == 'N/A' or val == 'n/a':
                return None
            try:
                return int(val)
            except:
                return None
        
        # Create the config object with required fields
        config = {
            "methodOfPayment": mop_code,
            "legalEntity": str(legal_entity_id)
        }
        
        # Handle funding configuration
        funding_hub_value = row.get('Funding Hub Configuration')
        is_conveyed = (row.get('Settled/Conveyed') == "conveyed" or 
                      row.get('Settled/Conveyed') == "Conveyed")
        
        # Look up the proper funding config ID based on combination
        funding_config_key = (funding_hub_value, is_conveyed)
        funding_config_id = funding_config_mapping.get(funding_config_key)
        
        if funding_config_id:
            config["fundingConfig"] = funding_config_id
            logger.info(f"Set fundingConfig to {funding_config_id} based on {funding_hub_value} and conveyed={is_conveyed}")
        else:
            config["fundingConfig"] = None
            logger.warning(f"No funding config found for {funding_hub_value} and conveyed={is_conveyed}")
        
        # Handle settlement service if applicable
        settlement_service_value = row.get('Settlement Services(ISS/NSS)')
        if pd.notna(settlement_service_value) and settlement_service_value != "null":
            config["settlementService"] = settlement_service_value
            logger.info(f"Set settlementService to {settlement_service_value}")
        else:
            config["settlementService"] = None
        
        # Add boolean flags - now with null support
        config["ndxDisputes"] = parse_bool(row.get('Non Delivery Disputes (NDX) applicable for MOP'))
        config["chargebackDisputes"] = parse_bool(row.get('Chargeback Disputes applicable on MOP'))
        
        # Handle settlement window
        settlement_window = parse_number(row.get('Settlement Window or Network funding'))
        config["settlementWindow"] = settlement_window
        if settlement_window is not None and settlement_window > 0:
            logger.info(f"Set settlementWindow to {settlement_window}")
        
        config["settlementWindowApplicableIndicator"] = parse_bool(row.get('Settlement Window Applicable Indicator'))
        
        # Add reporting flags - now with null support
        config["riskReportableIndicator"] = parse_bool(row.get('Risk Reportable'))
        config["chargebackReportableIndicator"] = parse_bool(row.get('Chargeback Reportable'))
        config["salesReportableIndicator"] = parse_bool(row.get('Sales Reportable'))
        config["refundReportableIndicator"] = parse_bool(row.get('Refund Reportable'))
        
        # Add these based on model in the image - set default values
        config["salesExposureIndicator"] = True
        config["refundExposureIndicator"] = True
        config["chargebackExposureIndicator"] = True
        
        logger.info(f"Completed processing for row {idx+2}")
        configs.append(config)
    
    # Write to JSON file
    try:
        with open(output_file, 'w') as f:
            json.dump(configs, f, indent=2)
            
        logger.info(f"Successfully wrote {len(configs)} configurations to {output_file}")
    except Exception as e:
        logger.error(f"Failed to write JSON file: {str(e)}")
    
    return configs

# Example usage
if __name__ == "__main__":
    excel_file = "payment_methods.xlsx"  # Change to your file path
    output_file = "credit_exposure_configs.json"
    
    configs = create_credit_exposure_configs(excel_file, output_file)
    
    if configs:
        print("\nSample Credit Exposure Configuration:")
        print(json.dumps(configs[0], indent=2))
        
    print(f"\nDone! Created {len(configs)} Credit Exposure Configurations.")
    print(f"Check processing.log for detailed processing information.")
