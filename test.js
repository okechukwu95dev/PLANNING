const mockDiagramData = {
  models: {
    NetworkProcessing: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'primaryId', type: 'CharField(16)' },
        { name: 'secondaryId', type: 'CharField(16)' },
        { name: 'country', type: 'ForeignKey', references: 'Country', onDelete: 'CASCADE' },
        { name: 'clearingId', type: 'CharField(16)' },
        { name: 'authorisationId', type: 'CharField(16)' },
        { name: 'networkEndpoint', type: 'CharField(16)' },
        { name: 'description', type: 'CharField(50)' }
      ]
    },
    PaymentAdapter: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'name', type: 'CharField(100)' }
      ]
    },
    FundingConfiguration: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'description', type: 'CharField(100)' },
        { name: 'settlementPlatform', type: 'CharField(100)' },
        { name: 'conveyed', type: 'BooleanField' }
      ]
    },
    MethodOfPaymentEndpointConfiguration: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'alias', type: 'CharField(200)' },
        { name: 'isDefault', type: 'BooleanField' },
        { name: 'transactionChannel', type: 'CharField' },
        { name: 'fundingConfig', type: 'ForeignKey', references: 'FundingConfiguration' }
      ]
    },
    NetworkConfiguration: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'legalEntity', type: 'ForeignKey', references: 'LegalEntity' },
        { name: 'methodOfPayment', type: 'ForeignKey', references: 'MethodOfPayment' },
        { name: 'networkProcessing', type: 'ForeignKey', references: 'NetworkProcessing' }
      ]
    },
    MerchantCapability: {
      fields: [
        { name: 'code', type: 'CharField(4)', isPrimary: true },
        { name: 'description', type: 'CharField(50)' }
      ]
    },
    MerchantStatus: {
      fields: [
        { name: 'code', type: 'CharField(4)', isPrimary: true },
        { name: 'description', type: 'CharField(50)' }
      ]
    },
    MerchantStatusCapability: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'merchantCapabilityCode', type: 'ForeignKey', references: 'MerchantCapability' },
        { name: 'merchantStatusCode', type: 'ForeignKey', references: 'MerchantStatus' },
        { name: 'allowed', type: 'BooleanField' }
      ]
    },
    NaicsIndustryClassification: {
      fields: [
        { name: 'naicsCode', type: 'CharField(6)', isPrimary: true },
        { name: 'naicsDescription', type: 'CharField(200)' }
      ]
    },
    MerchantCategoryCode: {
      fields: [
        { name: 'merchantCategoryCode', type: 'CharField(4)', isPrimary: true },
        { name: 'merchantCategoryName', type: 'CharField(200)' }
      ]
    },
    MerchantCategoryCodeMapping: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'merchantCategoryCode', type: 'ForeignKey', references: 'MerchantCategoryCode' },
        { name: 'naicsCode', type: 'ForeignKey', references: 'NaicsIndustryClassification' }
      ]
    },
    Rates: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'chargebackRate', type: 'DecimalField' },
        { name: 'refundRate', type: 'DecimalField' },
        { name: 'ndc', type: 'PositiveIntegerField' },
        { name: 'country', type: 'ForeignKey', references: 'Country' },
        { name: 'merchantCategoryCode', type: 'ForeignKey', references: 'MerchantCategoryCode' }
      ]
    },
    Country: {
      fields: [
        { name: 'numericCode', type: 'CharField(4)', isPrimary: true },
        { name: 'name', type: 'CharField(100)' },
        { name: 'officialName', type: 'CharField' },
        { name: 'alphaCode', type: 'CharField' },
        { name: 'threeLphaCode', type: 'CharField' }
      ]
    },
    Currency: {
      fields: [
        { name: 'numericCode', type: 'CharField', isPrimary: true },
        { name: 'name', type: 'CharField(100)' },
        { name: 'alphaCode', type: 'CharField' },
        { name: 'numberOfDecimals', type: 'PositiveIntegerField' }
      ]
    },
    MethodOfPaymentRouting: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'routingId', type: 'CharField(20)' },
        { name: 'methodOfPayment', type: 'ForeignKey', references: 'MethodOfPayment' }
      ]
    },
    LegalEntity: {
      fields: [
        { name: 'id', type: 'BigAutoField', isPrimary: true },
        { name: 'name', type: 'CharField(200)' }
      ]
    },
    MethodOfPayment: {
      fields: [
        { name: 'code', type: 'CharField(5)', isPrimary: true },
        { name: 'name', type: 'CharField(100)' }
      ]
    }
  },
  relationships: [
    { from: 'NetworkProcessing', to: 'Country', type: 'ForeignKey', field: 'country' },
    { from: 'NetworkConfiguration', to: 'LegalEntity', type: 'ForeignKey', field: 'legalEntity' },
    { from: 'NetworkConfiguration', to: 'MethodOfPayment', type: 'ForeignKey', field: 'methodOfPayment' },
    { from: 'NetworkConfiguration', to: 'NetworkProcessing', type: 'ForeignKey', field: 'networkProcessing' },
    { from: 'MethodOfPaymentEndpointConfiguration', to: 'FundingConfiguration', type: 'ForeignKey', field: 'fundingConfig' },
    { from: 'MerchantStatusCapability', to: 'MerchantCapability', type: 'ForeignKey', field: 'merchantCapabilityCode' },
    { from: 'MerchantStatusCapability', to: 'MerchantStatus', type: 'ForeignKey', field: 'merchantStatusCode' },
    { from: 'MerchantCategoryCodeMapping', to: 'MerchantCategoryCode', type: 'ForeignKey', field: 'merchantCategoryCode' },
    { from: 'MerchantCategoryCodeMapping', to: 'NaicsIndustryClassification', type: 'ForeignKey', field: 'naicsCode' },
    { from: 'Rates', to: 'Country', type: 'ForeignKey', field: 'country' },
    { from: 'Rates', to: 'MerchantCategoryCode', type: 'ForeignKey', field: 'merchantCategoryCode' },
    { from: 'MethodOfPaymentRouting', to: 'MethodOfPayment', type: 'ForeignKey', field: 'methodOfPayment' }
  ],
  metadata: {
    title: 'Payment System Complete Model Diagram',
    description: 'All payment system entities and their relationships',
    app_label: 'payments'
  },
  styling: {
    entityColors: {
      payment: '#f0f9ff',    // Light blue for payment entities
      merchant: '#f0fdf4',   // Light green for merchant entities
      reference: '#fff1f2',  // Light red for reference data
      routing: '#fdf4ff'     // Light purple for routing entities
    },
    relationshipStyles: {
      ForeignKey: 'solid',
      ManyToMany: 'dashed'
    }
  }
};

// Helper function to convert to Mermaid format
function convertToMermaid(data) {
  let mermaidStr = 'classDiagram\n';
  
  // Add classes with fields
  Object.entries(data.models).forEach(([modelName, model]) => {
    mermaidStr += `class ${modelName} {\n`;
    model.fields.forEach(field => {
      const fieldStr = field.isPrimary ? `+${field.name}* ${field.type}` : `+${field.name} ${field.type}`;
      mermaidStr += `    ${fieldStr}\n`;
    });
    mermaidStr += '}\n';
  });
  
  // Add relationships
  data.relationships.forEach(rel => {
    mermaidStr += `${rel.from} --> ${rel.to} : ${rel.field}\n`;
  });
  
  return mermaidStr;
}

export default mockDiagramData;
