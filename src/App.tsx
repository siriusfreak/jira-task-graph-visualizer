import React, { useState, useEffect } from 'react';
import { searchJiraTasks } from './jiraApi';
import DependencyGraph from './DependencyGraph';
import { Issue } from './types';
import './App.css';
import {
    AppBar,
    Toolbar,
    Typography,
    Paper, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import SavedJQLManager from './SavedJQLManager';  // Import the component




function App() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [selectedJQL, setSelectedJQL] = useState<string>('');
    const [issueTypes, setIssueTypes] = useState<string[]>([]);
    const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([]);
    const uniqueTypes = Array.from(new Set(issues.map(issue => issue.fields.issueType.name)));

    useEffect(() => {
        const fetchIssues = async () => {
            console.log('fetching issues');
            if (selectedJQL === '') {
                return;
            }
            const results = await searchJiraTasks(selectedJQL);
            console.log(results);
            setIssues(results);
        };

        fetchIssues();
    }, [selectedJQL]);

    useEffect(() => {

        setIssueTypes(uniqueTypes);
        setSelectedIssueTypes(uniqueTypes); // Initially all types are selected.
    }, [issues]);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        My Jira App
                    </Typography>
                </Toolbar>
            </AppBar>

            <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '320px', overflowY: 'auto', borderRight: '1px solid #e0e0e0', padding: 16 }}>
                    <Paper style={{ padding: 16 }}>

                        <SavedJQLManager setSelectedJQL={setSelectedJQL} />

                        {/* Provide a little space between components */}
                        <div style={{ margin: '16px 0' }}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Issue Types</InputLabel>
                                <Select
                                    multiple
                                    value={selectedIssueTypes}
                                    onChange={(e) => setSelectedIssueTypes(e.target.value as string[])}
                                    renderValue={(selected) => (selected as string[]).join(', ')}
                                >
                                    {issueTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <Checkbox checked={selectedIssueTypes.indexOf(type) > -1} />
                                            <ListItemText primary={type} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                </div>



                <div className="dependencyGraphContainer" style={{ flexGrow: 1, overflow: 'auto', height: '100%' }}>
                    <DependencyGraph
                        issues={issues.filter(issue =>
                            selectedIssueTypes.includes(issue.fields.issueType.name)
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
export default App;
