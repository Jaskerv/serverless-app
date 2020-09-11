import React, {
  ReactElement,
  useMemo,
  useState,
  KeyboardEvent,
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

const Input = (): ReactElement => {
  const [value, setValue] = useState('');

  const handleChange = (event: KeyboardEvent) => {
    setValue(event.key.replace(/[^a-z0-9]/gi, ''));
  };

  return (
    <TextField
      variant="outlined"
      value={value}
      onKeyPress={handleChange}
    />
  );
};

const generateInputs = (inputSize: Number): Array<Function> => (
  Array(inputSize).fill(0).map(() => Input)
);

export default function VerificationInput(props: VerificationInputProps): ReactElement {
  const { inputSize = 1, spacing = 1 } = props;
  const inputs = useMemo(() => generateInputs(inputSize), [inputSize]);
  return (
    <Box>
      <Grid container spacing={spacing}>
        {inputs.map((Component) => (
          <Grid item>
            <Component />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
