'use client'

import React, { useState, useEffect, Suspense } from 'react';
import styles from '../page.module.css';
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Grid } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';

interface Vulnerability {
    id: number;
    vulnerability: string;
    affectedSystem: string;
    threats: string;
    impact: string;
    metrics: { baseSeverity: string }[];
    vulnStatus: string;
    lastModified: string;
    recommendations: string;
}

const DetailsContent = ({ deviceName }: { deviceName: string | null }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [vulnerabilityData, setVulnerabilityData] = useState<Vulnerability[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (deviceName) {
                    const response = await fetch(`https://ladysnazzy.tech/vulnerabilities?keywordSearch=${deviceName}`);
                    const jsonData = await response.json();
                    setVulnerabilityData(jsonData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
    
        if (deviceName) {
            fetchData();
        }
    }, [deviceName]);
    

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getColorForSeverity = (severity: string): string => {
        const severityLowerCase = severity.toLowerCase();
        switch (severityLowerCase) {
            case 'none':
                return 'green';
            case 'low':
                return 'yellow';
            case 'medium':
                return 'orange';
            case 'high':
                return 'red';
            case 'critical':
                return 'darkred';
            default:
                return 'primary';
        }
    };


  return (
    <main className={styles.submain}>
        {loading ? (
            <CircularProgress />
        ) : (
            <div>
                <Button className={styles.backButton}>
                    <Link href="/">
                        <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
                            <Grid item style={{marginTop: '0.5rem'}}>
                                <ArrowBack />
                            </Grid>
                            <Grid item>
                                Back
                            </Grid>
                        </Grid>
                    </Link>
                </Button>
                <h1>Vulnerability Details</h1>
                <br/>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vulnerability</TableCell>
                            <TableCell>Affected System</TableCell>
                            <TableCell>Threats</TableCell>
                            <TableCell>Impact</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell>Recommendations</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {vulnerabilityData && vulnerabilityData.length > 0 && vulnerabilityData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{item.vulnerability}</TableCell>
                                    <TableCell>{item.affectedSystem}</TableCell>
                                    <TableCell>{item.threats}</TableCell>
                                    <TableCell>{item.impact}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ backgroundColor: getColorForSeverity(item.metrics[0].baseSeverity), borderRadius: '20px', padding:'10px', color:'white', textAlign:'center' }}>
                                            {item.metrics[0].baseSeverity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item.vulnStatus}</TableCell>
                                    <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
                                    <TableCell>{item.recommendations}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={vulnerabilityData ? vulnerabilityData.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </div>
        )}
    </main>
  );
}

export default function Details(): JSX.Element {
    const searchParams = useSearchParams();
    const deviceName = searchParams.get('name') || null;
    return (
        <main className={styles.submain}>
            <Suspense fallback={<CircularProgress />}>
                <DetailsContent deviceName={deviceName} />
            </Suspense>
        </main>
    );
}
