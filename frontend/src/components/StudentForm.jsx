import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';

const StudentForm = ({ setPredictionResult, setInputData, setIsLoading }) => {

  const [formData, setFormData] = useState({
    Hours_Studied: '',
    Attendance: '',
    Parental_Involvement: '',
    Access_to_Resources: '',
    Extracurricular_Activities: '',
    Sleep_Hours: '',
    Previous_Scores: '',
    Motivation_Level: '',
    Internet_Access: '',
    Tutoring_Sessions: '',
    Family_Income: '',
    Teacher_Quality: '',
    School_Type: '',
    Peer_Influence: '',
    Physical_Activity: '',
    Learning_Disabilities: '',
    Parental_Education_Level: '',
    Distance_from_Home: '',
    Gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state
    setInputData(formData); // Pass input data to parent
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setPredictionResult(result); // Pass prediction result to parent
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '100%', mx: 'auto' }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Student Performance Prediction
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please fill in the student's information below.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Numeric Inputs */}
            {[
              ['Hours_Studied', 'Hours Studied', 'number', 'e.g., per week'],
              ['Attendance', 'Attendance', 'number', 'e.g., %'],
              ['Sleep_Hours', 'Sleep Hours', 'number', 'per day'],
              ['Previous_Scores', 'Previous Scores', 'number', ''],
              ['Tutoring_Sessions', 'Tutoring Sessions', 'number', ''],
              ['Physical_Activity', 'Physical Activity', 'number', ''],
              ['Distance_from_Home', 'Distance from Home', 'number', 'in km'],
            ].map(([name, label, type, placeholder]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  type={type}
                  fullWidth
                  required
                  placeholder={placeholder}
                  variant="outlined"
                />
              </Grid>
            ))}

            {/* Categorical Inputs */}
            {[
              ['Parental_Involvement', 'Parental Involvement', ['Low', 'Medium', 'High']],
              ['Access_to_Resources', 'Access to Resources', ['Low', 'Medium', 'High']],
              ['Extracurricular_Activities', 'Extracurricular Activities', ['Yes', 'No']],
              ['Motivation_Level', 'Motivation Level', ['Low', 'Medium', 'High']],
              ['Internet_Access', 'Internet Access', ['Yes', 'No']],
              ['Family_Income', 'Family Income', ['Low', 'Medium', 'High']],
              ['Teacher_Quality', 'Teacher Quality', ['Low', 'Medium', 'High']],
              ['School_Type', 'School Type', ['Public', 'Private']],
              ['Peer_Influence', 'Peer Influence', ['Positive', 'Neutral', 'Negative']],
              ['Learning_Disabilities', 'Learning Disabilities', ['Yes', 'No']],
              ['Parental_Education_Level', 'Parental Education Level', ['None', 'High School', 'College', 'Postgraduate']],
              ['Gender', 'Gender', ['Male', 'Female', 'Other']],
            ].map(([name, label, options]) => (
              <Grid item xs={12} sm={6} key={name}>
                <FormControl fullWidth required variant="outlined" size="medium" sx={{ minWidth: 200 }}>
                  <InputLabel id={`${name}-label`}>{label}</InputLabel>
                  <Select
                    labelId={`${name}-label`}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    label={label}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  paddingY: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
              >
                Predict Performance
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default StudentForm;
