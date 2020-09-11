// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import VerificationInput, { VerificationInputProps } from './VerificationInput';

export default {
  title: 'Components/Verification Input',
  component: VerificationInput,
} as Meta;

const Template: Story<VerificationInputProps> = (args) => <VerificationInput {...args} />;

export const Input = Template.bind({});
Input.args = {
  inputSize: 6,
  spacing: 5,
};
