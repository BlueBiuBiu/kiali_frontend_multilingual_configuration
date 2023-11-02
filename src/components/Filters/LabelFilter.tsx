import * as React from 'react';
import { Button, ButtonVariant, Popover, PopoverPosition, TextInput } from '@patternfly/react-core';
import { KialiIcon } from '../../config/KialiIcon';
import { kialiStyle } from 'styles/StyleUtils';

interface LabelFiltersProps {
  filterAdd: (value: string) => void;
  isActive: (value: string) => boolean;
  onChange: (value: any) => void;
  value: string;
}

const infoIconStyle = kialiStyle({
  marginLeft: '0.5rem',
  alignSelf: 'center'
});

export const LabelFilters: React.FC<LabelFiltersProps> = (props: LabelFiltersProps) => {
  const onkeyPress = (e: any) => {
    if (e.key === 'Enter') {
      if (props.value && props.value.length > 0) {
        props.value.split(' ').map(val => !props.isActive(val) && props.filterAdd(val));
      }
    }
  };

  return (
    <>
      <TextInput
        type={'text'}
        value={props.value}
        aria-label={'filter_input_label_key'}
        placeholder={$t('placeholder35')}
        onChange={(_event, value) => props.onChange(value)}
        onKeyPress={e => onkeyPress(e)}
        style={{ width: 'auto' }}
      />
      <Popover
        headerContent={<span>{$t('LabelFilterHelp')}</span>}
        position={PopoverPosition.right}
        bodyContent={
          <>
            {$t('tip228')}
            <br />
            <ul style={{ listStyleType: 'circle', marginLeft: '20px' }}>
              <li>{$t('placeholder36')}: label</li>
              <li>{$t('placeholder37')}: label=value</li>
              <li>
                {$t('placeholder38')}:
                <br />
                label=value label2=value2,value2-2
                <br />
                {$t('tip229')}
              </li>
            </ul>
          </>
        }
      >
        <Button variant={ButtonVariant.link} className={infoIconStyle} isInline>
          <KialiIcon.Help />
        </Button>
      </Popover>
    </>
  );
};
