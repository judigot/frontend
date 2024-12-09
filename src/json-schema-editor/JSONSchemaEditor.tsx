import React, { useState, useEffect, useRef } from 'react';
import JSON5 from 'json5';
import { useWordEditor } from '@/json-schema-editor/hooks/useWordEditor';

import './scss/main.scss';

type IJsonSchema = Record<string, Record<string, unknown>[]>;

const initialSchema: IJsonSchema = {
  user: [
    {
      user_id: 1,
      name: 'John Doe',
    },
  ],
  order: [
    {
      order_id: 1,
      user_id: 1,
    },
  ],
};

const App: React.FC = () => {
  const [schema, setSchema] = useState<IJsonSchema>(initialSchema);
  const [newTableName, setNewTableName] = useState<string>('');
  const [schemaString, setSchemaString] = useState<string>(
    JSON5.stringify(initialSchema, null, 2),
  );
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const { handleWordEdit } = useWordEditor(schemaString);

  useEffect(() => {
    setSchemaString(JSON5.stringify(schema, null, 2));
  }, [schema]);

  const handleAddTable = () => {
    if (newTableName) {
      const newTableId = `${newTableName}_id`;

      // Check if newTableId already exists in the schema
      const doesTableIdExist = Object.values(schema).some((rows) =>
        rows.some((row) => newTableId in row),
      );

      if (!doesTableIdExist) {
        setSchema((prevSchema) => ({
          ...prevSchema,
          [newTableName]: [{ [newTableId]: 1 }],
        }));
        setNewTableName('');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTableName(event.target.value);
  };

  const renameProperty = (
    item: Record<string, unknown>,
    oldProp: string,
    newProp: string,
  ): Record<string, unknown> => {
    const newItem: Record<string, unknown> = {};
    for (const key in item) {
      if (key === oldProp) {
        newItem[newProp] = item[key];
      } else {
        newItem[key] = item[key];
      }
    }
    return newItem;
  };

  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    /* Tests:
    Test 1: Rename Table and Update Primary Key
    Before editing:
    { user: [ { user_id: 1, name: 'John Doe' } ], }
    Expected output:
    { userx: [ { userx_id: 1, name: 'John Doe' } ], }
  
    Test 2: Rename Table and Retain Additional Properties
    Before editing:
    { user: [ { user_id: 1, name: 'John Doe', desc: 1 } ], }
    Expected output:
    { userx: [ { userx_id: 1, name: 'John Doe', desc: 1 } ], }
  
    Test 3: Edit Row Values
    Before editing:
    { user: [ { user_id: 1, name: 'John Doe', desc: 1 } ], }
    Expected output:
    { user: [ { user_id: 1, name: 'John Doe', desc: 'Lorem ipsum' } ], }
  
    Test 4: Rename Table and Update Foreign Keys
    Before editing:
    {
      user: [ { user_id: 1, name: 'John Doe' } ],
      order: [ { order_id: 1, user_id: 1 } ],
    }
    Expected output:
    {
      userx: [ { userx_id: 1, name: 'John Doe' } ],
      order: [ { order_id: 1, userx_id: 1 } ],
    }
    */

    type IPrimaryKey = Record<string, unknown>;

    const ensurePrimaryKey = (
      schema: Record<string, IPrimaryKey[]>,
    ): Record<string, IPrimaryKey[]> => {
      const newSchema: Record<string, IPrimaryKey[]> = {};

      Object.keys(schema).forEach((table) => {
        newSchema[table] = schema[table].map((row, index) => {
          const primaryKey = `${table}_id`;
          const newRow: IPrimaryKey = { [primaryKey]: index + 1 }; // Primary key as the first property

          // Add remaining properties
          Object.keys(row).forEach((key) => {
            if (key !== primaryKey) {
              newRow[key] = row[key];
            }
          });

          return newRow;
        });
      });

      return newSchema;
    };
    const { previousWord, newWord } = handleWordEdit(e);
    const schemaStringBeforeEditing = schemaString;
    const newSchemaString = e.target.value;
    cursorPositionRef.current = e.target.selectionStart;
    const oldSchema: IJsonSchema = JSON5.parse(schemaStringBeforeEditing);

    try {
      const updatedSchema: IJsonSchema = JSON5.parse(newSchemaString);

      const isTableNameEdited =
        previousWord in oldSchema && !(previousWord in updatedSchema);

      if (isTableNameEdited) {
        const newSchema: IJsonSchema = {};
        const previousWordId = `${previousWord}_id`;
        const newWordId = `${newWord}_id`;

        // Store foreign key values for later update
        const foreignKeyValues: Record<string, Record<string, unknown>> = {};

        // Collect foreign key values and prepare the new schema
        for (const [tableName, rows] of Object.entries(oldSchema)) {
          if (tableName === previousWord) {
            newSchema[newWord] = rows.map((item) => {
              const newItem = renameProperty(item, previousWordId, newWordId);
              return newItem;
            });
          } else {
            newSchema[tableName] = rows.map((item, index) => {
              if (previousWordId in item) {
                foreignKeyValues[tableName] = {};
                foreignKeyValues[tableName][index] = item[previousWordId];
              }
              return { ...item };
            });
          }
        }

        // Update foreign key values in the new schema
        for (const [tableName, rows] of Object.entries(newSchema)) {
          newSchema[tableName] = rows.map((item) => {
            return renameProperty(item, previousWordId, newWordId);
          });
        }

        // Ensure the old table is removed from the schema
        const updatedSchemaWithoutOldTable = Object.fromEntries(
          Object.entries(newSchema).filter(([key]) => key !== previousWord),
        );
        setSchema(updatedSchemaWithoutOldTable);
      } else {
        setSchema(ensurePrimaryKey(updatedSchema));
      }

      setIsValidJson(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Allow partial and invalid JSON during editing
      setIsValidJson(false);
    }
    setSchemaString(newSchemaString);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      const { selectionStart, selectionEnd, value } = event.currentTarget;
      const newValue =
        value.slice(0, selectionStart) + '\n' + value.slice(selectionEnd);
      setSchemaString(newValue);
      cursorPositionRef.current = selectionStart + 1;
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.selectionStart = cursorPositionRef.current;
      textAreaRef.current.selectionEnd = cursorPositionRef.current;
    }
  }, [schemaString]);

  return (
    <>
      <div>
        <h1>JSON Database Schema Editor</h1>
      </div>
      <div>
        <div className="mb-4">
          <label
            htmlFor="newTableName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New Table Name
          </label>
          <input
            id="newTableName"
            type="text"
            value={newTableName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-300 dark:focus:border-indigo-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTable();
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
      <button
        onClick={handleAddTable}
        disabled={!newTableName}
        className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 
    ${newTableName ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}
    dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-300 dark:focus:ring-opacity-50 dark:disabled:bg-gray-600`}
      >
        Add Table
      </button>
      <br />
      <br />
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <textarea
          ref={textAreaRef}
          rows={10}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-300 dark:focus:border-indigo-300"
          value={schemaString}
          onChange={handleSchemaChange}
          onKeyDown={handleKeyDown}
        />
        {!isValidJson && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Invalid JSON format. Please correct it.
          </p>
        )}
      </div>
    </>
  );
};

export default App;
