import React, { useState, useEffect } from 'react';
import _ from 'lodash';

// Helper: flatten the object into field definitions
const flattenObj = (prefix, obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = {
      path: prefix ? `${prefix}.${key}` : key,
      type: value,
    };
    return acc;
  }, {});

// Helper: if the schema contains nested objects, create a tab for each sub-object
const reducer = (schema, root) =>
  Object.entries(schema).map(([key, value]) => ({
    tab: `${root} ${key}`,
    items: flattenObj(`${root}.${key}`, value),
  }));

// Create tabs from the schema, similar to a computed property in Vue
const createTabs = (schema) => {
  if (!schema) return [];
  let tabs = [];
  Object.entries(schema).forEach(([key, value]) => {
    if (Object.values(value).every((x) => x === 'string')) {
      tabs.push({
        tab: key,
        items: flattenObj(key, value),
      });
    } else {
      tabs = tabs.concat(reducer(value, key));
    }
  });
  return tabs;
};

const AdminCameraEditForm = ({ newForm, schema, adminCamera, onSave, onCancel, errorMsg, children }) => {
  // Fields to render as switches (checkboxes)
  const switches = ['VERBOSE', 'RAW_RTSP'];
  const [formData, setFormData] = useState(adminCamera || { processors: {} });
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const ready = !!schema;

  useEffect(() => {
    if (schema) {
      const newTabs = createTabs(schema);
      setTabs(newTabs);

      if (newForm) {
        const newData = _.cloneDeep(formData);
        newTabs.forEach((tab) => {
          Object.entries(tab.items).forEach(([property, item]) => {
            _.set(newData, `processors.${item.path}`, switches.includes(property) ? 'false' : '');
          });
        });
        setFormData(newData);
      }
    }
  }, [schema]);

  // Update a nested field value
  const handleInputChange = (path, value) => {
    const newData = _.cloneDeep(formData);
    _.set(newData, `processors.${path}`, String(value));
    setFormData(newData);
  };

  // Helper: get value from formData
  const getValue = (path) => _.get(formData, `processors.${path}`, '');

  // Helper: format label (capitalize and replace underscores)
  const title = (t) =>
    t.split('_')
      .join(' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      {ready ? (
        <form onSubmit={handleSubmit}>
          {/* Optional prepend slot */}
          {children && children({ data: formData, setValue: handleInputChange })}

          {/* Tabs Header */}
          <div className="mb-4">
            <div className="flex space-x-4 border-b mb-4">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`py-2 px-4 -mb-px border-b-2 ${
                    activeTab === index
                      ? 'border-blue-500 font-semibold'
                      : 'border-transparent'
                  }`}
                >
                  {title(tab.tab)}
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            <div>
              {tabs[activeTab] && (
                <div>
                  {Object.entries(tabs[activeTab].items).map(([property, item]) => (
                    <div key={item.path} className="mb-4">
                      <label className="block mb-1 font-medium">{title(property)}</label>
                      <div>
                        {switches.includes(property) ? (
                          <input
                            type="checkbox"
                            checked={getValue(item.path) === 'true'}
                            onChange={(e) =>
                              handleInputChange(item.path, e.target.checked ? 'true' : 'false')
                            }
                            className="form-checkbox"
                          />
                        ) : (
                          <input
                            type="text"
                            value={getValue(item.path)}
                            onChange={(e) => handleInputChange(item.path, e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Display error message if any */}
          {errorMsg && (
            <div className="text-red-500 mb-4">{errorMsg}</div>
          )}

          {/* Form Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default AdminCameraEditForm;
