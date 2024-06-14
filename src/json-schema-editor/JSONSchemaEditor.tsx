import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  TextareaAutosize,
} from '@mui/material';
import JSON5 from 'json5';
import { useWordEditor } from '@/json-schema-editor/hooks/useWordEditor';

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
      setSchema((prevSchema) => ({
        ...prevSchema,
        [newTableName]: [{ [newTableId]: 1 }],
      }));
      setNewTableName('');
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
          const newRow: IPrimaryKey = {
            [primaryKey]: row[primaryKey] ?? index + 1,
          }; // Primary key as the first property

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
            newSchema[newWord] = (rows as Record<string, unknown>[]).map(
              (item) => {
                const newItem = renameProperty(item, previousWordId, newWordId);
                return newItem;
              },
            );
          } else {
            newSchema[tableName] = (rows as Record<string, unknown>[]).map(
              (item, index) => {
                if (previousWordId in item) {
                  foreignKeyValues[tableName] = {};
                  foreignKeyValues[tableName][index] = item[previousWordId];
                }
                return { ...item };
              },
            );
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
    } catch (error) {
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
    <Container>
      <Grid container spacing={3} style={{ padding: 16 }}>
        <Grid item xs={12}>
          <TextField
            label="Enter new table"
            value={newTableName}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTable();
                e.preventDefault();
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTable}
            disabled={!newTableName}
          >
            Add Table
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Schema:</Typography>
            <TextareaAutosize
              ref={textAreaRef}
              minRows={10}
              style={{
                height: '50px',
                width: '100%',
                resize: 'none',
                fontSize: 15,
                overflowY: 'scroll',
              }}
              value={schemaString}
              onChange={handleSchemaChange}
              onKeyDown={handleKeyDown}
            />
            {!isValidJson && (
              <Typography color="error">
                Invalid JSON format. Please correct it.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
