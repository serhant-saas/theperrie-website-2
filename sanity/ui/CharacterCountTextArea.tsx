import React, { useCallback, useEffect, useState } from 'react';
import {
  FormField,
  PatchEvent,
  set,
  unset,
  StringInputProps,
  StringSchemaType,
} from 'sanity';
import { TextInput, Box, TextArea } from '@sanity/ui';

type CharacterCountTextAreaProps = {
  sanityProps: StringInputProps<StringSchemaType>;
  maxLength: number;
};

const CharacterCountTextArea = ({
  sanityProps,
  maxLength,
}: CharacterCountTextAreaProps) => {
  const { value, onChange, elementProps } = sanityProps;
  const [charCount, setCharCount] = useState(value ? value.length : 0);

  useEffect(() => {
    setCharCount(value ? value.length : 0);
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.currentTarget.value;
      setCharCount(newValue.length);
      onChange(PatchEvent.from(newValue ? set(newValue) : unset()));
    },
    [onChange]
  );

  return (
    <FormField>
      <TextArea
        {...elementProps}
        value={value || ''}
        onChange={handleChange}
        inputMode='text'
        style={{ width: '100%' }}
        rows={4}
        maxLength={maxLength}
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

export { CharacterCountTextArea };
