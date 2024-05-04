'use client'

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'
import { Button, Box, CircularProgress, MenuItem, TextField } from '@mui/material';
import styles from "./page.module.css";
import Link from 'next/link';


export default function Home() {
  // const router = useRouter()

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [device, setDevice] = useState('');
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ladysnazzy.tech/category');
        const jsonData = await response.json();
        setCategoryData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    const selectedDevices = categoryData.find((category) => category.name === selectedCategory)?.devices || [];
    setDevices(selectedDevices);
    setDevice('');
  };

  const handleDeviceChange = (event) => {
    setDevice(event.target.value);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   router.push(`/vulnerabilities?deviceName=${device}`);
  // };
  
  return (
    <main className={styles.main}>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <div className={styles.description}>
            <div>
              <h1 className={styles.title}>
                Smart Home Risk Assessment
              </h1>
              <br />
              <p>
                Smart home risk assessments are essential to identify hazards, threats, vulnerabilities and risks that may potentially cause harm to our devices.
              </p>
            </div>
          </div>
          <div className={styles.center}>
            <form 
              // onSubmit={handleSubmit}
            >
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { 
                    m: 1, 
                    width: '30ch'
                  },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    id="outlined-select-category"
                    select
                    label="Select Category"
                    value={category}
                    onChange={handleCategoryChange}
                    className={styles.textfield}
                  >
                    {categoryData?.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div>
                  <TextField
                    id="outlined-select-device"
                    select
                    label="Select Device"
                    value={device}
                    onChange={handleDeviceChange}
                    disabled={!devices.length}
                    className={styles.textfield}
                  >
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.name}>
                        {device.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div style={{margin: '2rem', cursor: 'pointer'}}>
                  <Button 
                    // type="submit" 
                    disabled={!device} 
                    color='primary'
                    className={styles.SubmitButton}
                  >
                    <Link
                      href={{
                        pathname: '/vulnerabilities',
                        query: { name: device },
                      }}
                    >
                      GET DETAILS
                    </Link>
                  </Button>
                </div>
              </Box>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
