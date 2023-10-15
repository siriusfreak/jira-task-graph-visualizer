import React, { useState, useEffect,  Dispatch, SetStateAction } from 'react';

import {
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from '@mui/material';import DeleteIcon from '@mui/icons-material/Delete';

const SERVICE_BASE_URL = 'https://swiss-knife.i.siriusfrk.ru';
interface JQL {
    id: string;
    name: string;
    jql: string;
}

type SavedJQLManagerProps = {
    setSelectedJQL: Dispatch<SetStateAction<string>>;
};

const SavedJQLManager: React.FC<SavedJQLManagerProps> = ({ setSelectedJQL }) => {
    const [jqls, setJQLs] = useState<JQL[]>([]);
    const [newJQLName, setNewJQLName] = useState<string>('');
    const [newJQLQuery, setNewJQLQuery] = useState<string>('');
    const [selectedJQLState, setSelectedJQLState] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedJQLs = async () => {
            const response = await fetch(`${SERVICE_BASE_URL}/api/v1/jira/saved-jql`);
            const data = await response.json();
            setJQLs(data.savedJQL);

            if (selectedJQLState === null && data.savedJQL.length > 0) {
                handleMenuItemClick(data.savedJQL[0]);
            }
        };

        fetchSavedJQLs();
    }, []);

    const handleMenuItemClick = (selectedJql: JQL) => {
        setSelectedJQL(selectedJql.jql);       // Inform the parent about the change
        setSelectedJQLState(selectedJql.id); // Update the local state
    };

    const handleDelete = async (id: string) => {
        await fetch(`${SERVICE_BASE_URL}/api/v1/jira/saved-jql/${id}`, {
            method: 'DELETE',
        });
        // Refresh the list after deleting
        const updatedJQLs = jqls.filter(jql => jql.id !== id);
        setJQLs(updatedJQLs);
    };

    const [openDialog, setOpenDialog] = useState(false); // State for modal open/close

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const handleSave = async () => {
        const response = await fetch(`${SERVICE_BASE_URL}/api/v1/jira/saved-jql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newJQLName,
                jql: newJQLQuery,
            }),
        });
        const data = await response.json();
        if (jqls === undefined) {
            setJQLs([data.jql]);  // Add the newly saved JQL to the list
        } else {
            setJQLs([...jqls, data.jql]);  // Add the newly saved JQL to the list
        }
        setNewJQLName('');  // Clear the input
        setNewJQLQuery('');  // Clear the input
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Select
                    value={selectedJQLState}
                    style={{ flexGrow: 1 }}
                >
                    {jqls.map(jql => (
                        <MenuItem key={jql.id} value={jql.id} onClick={() => handleMenuItemClick(jql)}>
                            {jql.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                <Button variant="outlined" style={{ marginLeft: '8px' }} onClick={handleOpenDialog}>
                    New
                </Button>
                <Button variant="outlined" style={{ marginLeft: '8px' }} onClick={() => handleDelete(selectedJQLState!)}>
                    Delete
                </Button>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New JQL</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={newJQLName}
                        onChange={(e) => setNewJQLName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="JQL Query"
                        fullWidth
                        multiline
                        value={newJQLQuery}
                        onChange={(e) => setNewJQLQuery(e.target.value)}
                        style={{ marginTop: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SavedJQLManager;
