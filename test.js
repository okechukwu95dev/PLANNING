/* SinglePageDiagram.js */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import mermaid from 'mermaid';
const sanitize = (name) => name.replace(/[^a-zA-Z0-9]/g, '_');
const escape = (text) => text.replace(/[\[\]]/g, '\\$&');
function buildEntityDiagram() {
  if (!entityName) return 'classDiagram\nclass NoSelection { }';

  const model = data.models[entityName];
  if (!model) return 'classDiagram\nclass Missing {}';

  let diagram = 'classDiagram\n';

  // Add the main entity and its fields
  diagram += `class ${sanitize(entityName)} {\n`;
  model.fields.forEach((field) => {
    const fieldStr = field.isPrimary
      ? `+${escape(field.name)}* ${escape(field.type)}`
      : `+${escape(field.name)} ${escape(field.type)}`;
    diagram += `  ${fieldStr}\n`;
  });
  diagram += '}\n';

  // Add relationships touching this entity
  data.relationships.forEach((rel) => {
    if (rel.from === entityName || rel.to === entityName) {
      const from = sanitize(rel.from);
      const to = sanitize(rel.to);
      diagram += `${from} --> ${to} : ${escape(rel.field)}\n`;
    }
  });

  return diagram;
}

// Helper functions
const sanitize = (name) => name.replace(/[^a-zA-Z0-9]/g, '_');
const escape = (text) => text.replace(/[\[\]]/g, '\\$&');

// Initialize Mermaid once
mermaid.initialize({ startOnLoad: false });

// 1) Mock data
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
      payment: '#f0f9ff',
      merchant: '#f0fdf4',
      reference: '#fff1f2',
      routing: '#fdf4ff'
    },
    relationshipStyles: {
      ForeignKey: 'solid',
      ManyToMany: 'dashed'
    }
  }
};

// 2) Helper function: convert entire data to a Mermaid "classDiagram" string
function convertToMermaid(data) {
  let mermaidStr = 'classDiagram\n';

  // Add classes with fields
  Object.entries(data.models).forEach(([modelName, model]) => {
    mermaidStr += `class ${modelName} {\n`;
    model.fields.forEach((field) => {
      const fieldStr = field.isPrimary
        ? `+${field.name}* ${field.type}`
        : `+${field.name} ${field.type}`;
      mermaidStr += `    ${fieldStr}\n`;
    });
    mermaidStr += '}\n';
  });

  // Add relationships
  data.relationships.forEach((rel) => {
    mermaidStr += `${rel.from} --> ${rel.to} : ${rel.field}\n`;
  });

  return mermaidStr;
}

// 3) Component: Full Diagram of the entire payment system
function PaymentSystemDiagram({ data }) {
  const [diagramCode, setDiagramCode] = useState('');

  useEffect(() => {
    // Build the full diagram from data
    const code = convertToMermaid(data);
    setDiagramCode(code);
  }, [data]);

  useEffect(() => {
    if (diagramCode) {
      mermaid.contentLoaded();
    }
  }, [diagramCode]);

  return (
    <div>
      <h2>Full Payment System Diagram</h2>
      <div className="mermaid">{diagramCode}</div>
    </div>
  );
}

// 4) Component: SingleEntityDiagram (focus on one entity + direct relations)
function SingleEntityDiagram({ data, entityName }) {
  const [diagramCode, setDiagramCode] = useState('');

  function buildEntityDiagram() {
    if (!entityName) return 'classDiagram\nclass NoSelection { }';

    const model = data.models[entityName];
    if (!model) return `classDiagram\nclass Missing {}`;

    let diagram = 'classDiagram\n';

    // The main entity with its fields
    diagram += `class ${entityName} {\n`;
    model.fields.forEach((field) => {
      const fieldStr = field.isPrimary
        ? `+${field.name}* ${field.type}`
        : `+${field.name} ${field.type}`;
      diagram += `    ${fieldStr}\n`;
    });
    diagram += '}\n';

    // Add relationships that touch this entity
    data.relationships.forEach((rel) => {
      if (rel.from === entityName || rel.to === entityName) {
        // Add the other class if not in the diagram
        const otherSide = rel.from === entityName ? rel.to : rel.from;
        if (!diagram.includes(`class ${otherSide} `)) {
          diagram += `class ${otherSide} {\n}\n`; // minimal definition
        }
        diagram += `${rel.from} --> ${rel.to} : ${rel.field}\n`;
      }
    });

    return diagram;
  }

  useEffect(() => {
    setDiagramCode(buildEntityDiagram());
  }, [entityName, data]);

  useEffect(() => {
    if (diagramCode) {
      mermaid.contentLoaded();
    }
  }, [diagramCode]);

  if (!entityName) {
    return <p>Please select an entity...</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>{entityName} Diagram</h2>
      <div className="mermaid">{diagramCode}</div>
    </div>
  );
}

// 5) Component: ModelList (list of all models + button to select)
function ModelList({ models, onSelect }) {
  return (
    <div>
      <h3>All Models</h3>
      <ul>
        {Object.keys(models).map((modelName) => (
          <li key={modelName}>
            <button onClick={() => onSelect(modelName)}>
              {modelName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 6) Main App: combine the list, the full diagram, and single-entity diagram
function App() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '2rem', margin: '1rem' }}>
      {/* Left side: list of all models */}
      <div style={{ minWidth: '200px' }}>
        <ModelList
          models={mockDiagramData.models}
          onSelect={(modelName) => setSelectedModel(modelName)}
        />
      </div>

      {/* Right side: show the full system + optional single-entity diagram */}
      <div style={{ flex: 1 }}>
        <PaymentSystemDiagram data={mockDiagramData} />
        {selectedModel && (
          <SingleEntityDiagram
            data={mockDiagramData}
            entityName={selectedModel}
          />
        )}
      </div>
    </div>
  );
}

// 7) Render the entire thing to #root (no exports, just one file).
ReactDOM.render(<App />, document.getElementById('root'));
