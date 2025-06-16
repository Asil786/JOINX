 
import React from 'react';
import {LocalRaiseHand} from '../../../subComponents/livestream';
import ToolbarItem from '../../../atoms/ToolbarItem';

export interface LiveStreamControlsProps {
  showControls: boolean;
  showLabel?: boolean;
  customProps?: any;
}

const LiveStreamControls = (props: LiveStreamControlsProps) => {
  const {showControls} = props;
  if (!$config.RAISE_HAND) return <></>;
  if (!showControls) return <></>;
  return (
    <>
      <ToolbarItem toolbarProps={props?.customProps}>
        <LocalRaiseHand />
      </ToolbarItem>
    </>
  );
};

export default LiveStreamControls;
