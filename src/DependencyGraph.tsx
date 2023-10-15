import React, { useEffect, useRef } from 'react';
import { Network, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data';
import { Issue } from "./types";

interface DependencyGraphProps {
    issues: Issue[];
}

const labelByStatus = (status: string) => {
    switch (status) {
        case "In Progress":
            return "👨‍💻In Progress";
        case "Code Review":
            return "🔥Code Review";
        case "Ready to DEV":
            return "🟩Ready to DEV";
        case "TO DEPLOY":
            return "🏃‍TO DEPLOY";
        case "To-Do":
            return "🟦To-Do";
        default:
            return status;
    }
}

const colorByIssueType = (issueType: string) => {
   switch (issueType) {
         case "Epic":
                return {
                    color: "#d900ff",
                    font: {
                        color: "#FFFFFF"
                    }
                };
       case "Story":
           return {
               color: "#2bef24",
               font: {
                   color: "#FFFFFF"
               }
           };
            case "Task":
                return {
                    color: "#99CCFF",
                    font: {
                        color: "#FFFFFF"
                    }
                };
            case "Bug":
                return {
                    color: "#FF0000",
                    font: {
                        color: "#FFFFFF"
                    }
                };
            case "Incident":
                return {
                    color: "#FF0000",
                    font: {
                        color: "#FFFFFF"
                    }
                };
            case "sla-incident":
                return {
                    color: "#FF0000",
                    font: {
                        color: "#FFFFFF"
                    }
                };
            default:
                return {
                    color: "#FFFFFF",
                }
   }
}

const blurText = (text: string) => {
    return text.replace(/./g, "▮");
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ issues }) => {
    const networkContainer = useRef(null);

    useEffect(() => {
        if (networkContainer.current) {
            const nodes: any[] = [];
            const edges: any[] = [];

            nodes.push({
                id: "Unparented",
            });
            // select out epics
            const epics = issues.filter(issue => issue.fields.issueType.name === "Epic");
            for (const issue of issues) {
                console.log(issue.key,issue)
                let hasLink = false;
                for (const link of issue.fields.issueLinks) {
                    if (link.outwardIssue === undefined) {
                        continue
                    }
                    if (issue.fields.issueType.name !== "Epic" && link.type.name !== "Clone" && issues.some(issue => issue.key === link.outwardIssue?.key)) {
                        hasLink = true;
                        edges.push({to: issue.key, from: link.outwardIssue.key, arrows: {to: {enabled: true}}});
                    }
                }

                if (!hasLink || issue.fields.issueType.name === "Sub-task") {
                    if (issue.fields.parent?.key && issues.some(issues => issues.key === issue.fields.parent?.key)) {
                        edges.push({to: issue.key, from: issue.fields.parent.key, arrows: {to: {enabled: true}}});
                    } else if (issue.fields.epicName && epics.some(epic => epic.key === issue.fields.epicName)) {
                        edges.push({to: issue.key, from: issue.fields.epicName, arrows: {to: {enabled: true}}});
                    } else if (issue.fields.issueType.name !== "Epic") {
                        edges.push({from: "Unparented", to: issue.key});
                    }
                }

                nodes.push({
                    id: issue.key,
                    label:"[" + issue.key + "]" + issue.fields.summary + " (" + labelByStatus(issue.fields.status.name) + ")",
                    shape: 'box',  // Set the shape of node to 'box'\
                    url: "https://gfgroup.atlassian.net/browse/" + issue.key,
                    widthConstraint: {
                        maximum: 200,
                    },
                    ...colorByIssueType(issue.fields.issueType.name),
                });
            }

            const graphData = {
                nodes: new DataSet(nodes),
                edges: new DataSet(edges),
            };

            const options: Options = {
                physics: {
                    enabled: true,
                    solver: "forceAtlas2Based",
                    forceAtlas2Based: {
                        damping: 1,
                        avoidOverlap: 0.5,
                    },
                }
            }

            const network = new Network(networkContainer.current, graphData, options);

            network.on("click", (params) => {
                if (params.nodes.length > 0) {
                    const clickedNodeId = params.nodes[0];
                    const clickedNode = nodes.find(node => node.id === clickedNodeId);
                    if (clickedNode && clickedNode.url) {
                        window.open(clickedNode.url, "_blank"); // Open the Jira issue page in a new tab
                    }
                }
            });
        }

    }, [issues]);

    return <div ref={networkContainer} className="dependencyGraphContainer"></div>;
}

export default DependencyGraph;
