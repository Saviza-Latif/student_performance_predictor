import React, { useState } from 'react';
import {
  TextField, Button, Grid, MenuItem, Select, InputLabel,
  FormControl, Tooltip, Paper, Typography, Box
} from '@mui/material';
import axios from 'axios';

export default function StudentForm({ setPrediction }) {
  const [formData, setFormData] = useState({
    Hours_Studied: '', Attendance: '', Parental_Involvement: '', Access_to_Resources: '',
    Extracurricular_Activities: '', Sleep_Hours: '', Previous_Scores: '', Motivation_Level: '',
    Internet_Access: '', Tutoring_Sessions: '', Family_Income: '', Teacher_Quality: '',
    School_Type: '', Peer_Influence: '', Physical_Activity: '', Learning_Disabilities: '',
    Parental_Education_Level: '', Distance_from_Home: '', Gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatted = {
      ...formData,
      Hours_Studied: parseFloat(formData.Hours_Studied),
      Attendance: parseFloat(formData.Attendance),
      Parental_Involvement: parseFloat(formData.Parental_Involvement),
      Access_to_Resources: parseFloat(formData.Access_to_Resources),
      Extracurricular_Activities: parseFloat(formData.Extracurricular_Activities),
      Sleep_Hours: parseFloat(formData.Sleep_Hours),
      Previous_Scores: parseFloat(formData.Previous_Scores),
      Motivation_Level: parseFloat(formData.Motivation_Level),
      Internet_Access: parseInt(formData.Internet_Access),
      Tutoring_Sessions: parseInt(formData.Tutoring_Sessions),
      Family_Income: parseFloat(formData.Family_Income),
      Teacher_Quality: parseFloat(formData.Teacher_Quality),
      Peer_Influence: parseFloat(formData.Peer_Influence),
      Physical_Activity: parseFloat(formData.Physical_Activity),
      Learning_Disabilities: parseInt(formData.Learning_Disabilities),
      Distance_from_Home: parseFloat(formData.Distance_from_Home),
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', formatted);
      setPrediction(response.data.predicted_score);
    } catch (error) {
      console.error('Prediction error:', error);
      alert("Prediction failed. Please try again.");
    }
  };

  const numericFields = [
    ['Hours_Studied', 'Hours Studied', 0, 15, 0.1, '0–15 hrs/day'],
    ['Attendance', 'Attendance (%)', 0, 100, 1, '0–100%'],
    ['Parental_Involvement', 'Parental Involvement', 0, 10, 0.1, '0–10 scale'],
    ['Access_to_Resources', 'Access to Resources', 0, 10, 0.1, '0–10 scale'],
    ['Extracurricular_Activities', 'Extracurricular Activities', 0, 10, 0.1, '0–10 scale'],
    ['Sleep_Hours', 'Sleep Hours', 0, 12, 0.1, '0–12 hrs/night'],
    ['Previous_Scores', 'Previous Scores (%)', 0, 100, 1, '0–100%'],
    ['Motivation_Level', 'Motivation Level', 0, 10, 0.1, '0–10 scale'],
    ['Internet_Access', 'Internet Access (0 = No, 1 = Yes)', 0, 1, 1, '0 or 1'],
    ['Tutoring_Sessions', 'Tutoring Sessions per Week', 0, 10, 1, '0–10 sessions'],
    ['Family_Income', 'Family Income (in thousands)', 0, 500, 1, 'in thousands'],
    ['Teacher_Quality', 'Teacher Quality', 0, 10, 0.1, '0–10 scale'],
    ['Peer_Influence', 'Peer Influence', 0, 10, 0.1, '0–10 scale'],
    ['Physical_Activity', 'Physical Activity (hrs/week)', 0, 20, 0.5, '0–20 hrs'],
    ['Learning_Disabilities', 'Learning Disabilities (0 or 1)', 0, 1, 1, '0 or 1'],
    ['Distance_from_Home', 'Distance from Home (km)', 0, 100, 0.1, '0–100 km'],
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={600} textAlign="center">
        Student Performance Prediction Form
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Numeric Fields */}
          {numericFields.map(([name, label, min, max, step, helper]) => (
            <Grid item xs={12} sm={4} key={name}>
              <Tooltip title={helper} arrow placement="top-start">
                <TextField
                  type="number"
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min, max, step }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{ minWidth: 250 }}
                />
              </Tooltip>
            </Grid>
          ))}

          {/* Select Fields */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required sx={{ minWidth: 250 }}>
              <InputLabel id="school-type-label">School Type</InputLabel>
              <Select
                labelId="school-type-label"
                id="School_Type"
                name="School_Type"
                value={formData.School_Type}
                onChange={handleChange}
                label="School Type"
              >
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required sx={{ minWidth: 250 }}>
              <InputLabel id="parent-edu-label">Parental Education</InputLabel>
              <Select
                labelId="parent-edu-label"
                id="Parental_Education_Level"
                name="Parental_Education_Level"
                value={formData.Parental_Education_Level}
                onChange={handleChange}
                label="Parental Education"
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="High School">High School</MenuItem>
                <MenuItem value="Bachelor">Bachelor</MenuItem>
                <MenuItem value="Master">Master</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required sx={{ minWidth: 250 }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="Gender"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem', mt: 2 }}
            >
              Predict Exam Score
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
