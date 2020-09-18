import React, {
  ReactElement,
  useState,
  FormEvent,
} from 'react';
import {
  Box,
  Grid,
  GridSpacing,
  TextField,
} from '@material-ui/core';

export interface VerificationInputProps {
  inputSize: Number,
  spacing: GridSpacing
}

interface InputProps{
  value: String,
  onChange: (event: FormEvent) => void
}

const Input = ({ value, onChange }: InputProps): ReactElement => (
  <TextField
    variant="outlined"
    value={value}
    onChange={onChange}
  />
);

export default function VerificationInput(props: VerificationInputProps): ReactElement {
  const { inputSize = 1, spacing = 1 } = props;

  const [inputValues, setInputValues] = useState<String[]>(Array(inputSize > 12 ? 12 : inputSize).map(() => ''));

  const handleChange = (index: number) => (event: FormEvent) => {
    setInputValues((prevVal) => {
      const newValue: String[] = [...prevVal];
      const target = event.target as HTMLInputElement;
      newValue[index] = target.value;
      return newValue;
    });
  };

  return (
    <Box>
      <Grid container spacing={spacing > 10 ? 10 : spacing}>
        {inputValues.map((value, index) => (
          <Grid item key={index}>
            <Input value={value} onChange={handleChange(index)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
