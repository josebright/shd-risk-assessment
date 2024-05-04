'use client'

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Grid } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Link from 'next/link'

export default function Details() {
    const searchParams = useSearchParams()
    const deviceName = searchParams.get('name')

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [vulnerabilityData, setVulnerabilityData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`https://ladysnazzy.tech/vulnerabilities?keywordSearch=${deviceName}`);
            const jsonData = await response.json();
            setVulnerabilityData(jsonData);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        };
    
        fetchData();
    }, [deviceName]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
      
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                        {vulnerabilityData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{item.vulnerability}</TableCell>
                                <TableCell>{item.affectedSystem}</TableCell>
                                <TableCell>{item.threats}</TableCell>
                                <TableCell>{item.impact}</TableCell>
                                <TableCell>{item.metrics[0].baseSeverity}</TableCell>
                                <TableCell>{item.vulnStatus}</TableCell>
                                <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
                                <TableCell>{item.recommendations}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={vulnerabilityData.length}
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
