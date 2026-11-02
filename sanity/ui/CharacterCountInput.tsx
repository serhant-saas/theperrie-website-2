import { Box, TextInput } from '@sanity/ui';
import React, { useCallback, useEffect, useState } from 'react';
import type { StringInputProps, StringSchemaType } from 'sanity';
import { FormField, PatchEvent, set, unset } from 'sanity';

type CharacterCountInputProps = {
  sanityProps: StringInputProps<StringSchemaType>;
  maxLength: number;
};

const CharacterCountInput = ({
  sanityProps,
  maxLength,
}: CharacterCountInputProps) => {
  const { value, onChange, elementProps } = sanityProps;
  const [charCount, setCharCount] = useState(value ? value.length : 0);

  useEffect(() => {
    setCharCount(value ? value.length : 0);
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setCharCount(newValue.length);
      onChange(PatchEvent.from(newValue ? set(newValue) : unset()));
    },
    [onChange]
  );

  return (
    <FormField>
      <TextInput
        {...elementProps}
        value={value || ''}
        onChange={handleChange}
        inputMode='text'
        style={{ width: '100%' }}
        maxLength={maxLength}
        rows={3}
      />
      <Box
        padding={2}
        style={{ fontSize: '0.9em', color: '#666', textAlign: 'right' }}
      >
        {charCount} / {maxLength} characters
      </Box>
    </FormField>
  );
};

export { CharacterCountInput };
