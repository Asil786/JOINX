import { I18nBaseType, I18nDynamicType } from '../i18nTypes';

export const room = 'Room';
export const createRoomHeading = `create${room}Heading`;
export const createRoomInputLabel = `create${room}InputLabel`;
export const createRoomInputPlaceholderText = `create${room}InputPlaceholderText`;
export const createRoomMakeEveryOneCoHost = `create${room}MakeEveryOneCoHost`;
export const createRoomMakeEveryOneCoHostTooltipText = `create${room}MakeEveryOneCoHostTooltipText`;

export const createRoomAllowPhoneNumberJoining = `create${room}AllowPhoneNumberJoining`;
export const createRoomAllowPhoneNumberJoiningTooltipText = `create${room}AllowPhoneNumberJoiningTooltipText`;

export const createRoomBtnText = `create${room}BtnText`;
export const createRoomJoinWithID = `create${room}JoinWithID`;

export const createRoomSuccessToastHeading = `create${room}SuccessToastHeading`;
export const createRoomSuccessToastSubHeading = `create${room}SuccessToastSubHeading`;

export const createRoomErrorToastHeading = `create${room}ErrorToastHeading`;
export const createRoomErrorToastSubHeading = `create${room}ErrorToastSubHeading`;

// Developer credit label
export const createRoomMadeByLabel = `create${room}MadeByLabel`;

export interface I18nCreateScreenLabelsInterface {
  [createRoomHeading]?: I18nBaseType;
  [createRoomInputLabel]?: I18nBaseType;
  [createRoomInputPlaceholderText]?: I18nBaseType;
  [createRoomMakeEveryOneCoHost]?: I18nBaseType;
  [createRoomMakeEveryOneCoHostTooltipText]?: I18nBaseType;
  [createRoomAllowPhoneNumberJoining]?: I18nBaseType;
  [createRoomAllowPhoneNumberJoiningTooltipText]?: I18nBaseType;
  [createRoomBtnText]?: I18nBaseType;
  [createRoomJoinWithID]?: I18nBaseType;
  [createRoomSuccessToastHeading]?: I18nDynamicType;
  [createRoomSuccessToastSubHeading]?: I18nBaseType;
  [createRoomErrorToastHeading]?: I18nBaseType;
  [createRoomErrorToastSubHeading]?: I18nBaseType;
  [createRoomMadeByLabel]?: I18nBaseType; // Added interface field
}

export const CreateScreenLabels: I18nCreateScreenLabelsInterface = {
  [createRoomHeading]: ({ eventMode, audioRoom }) => {
    if (audioRoom) {
      return eventMode ? 'Create a Audio Livecast' : 'Create a Voice Chat';
    }
    return eventMode ? 'Create a Livestream' : 'Create a Room';
  },
  [createRoomInputLabel]: ({ eventMode, audioRoom }) => {
    if (audioRoom) {
      return eventMode ? 'Audio Livecast Name' : 'Voice Chat Name';
    }
    return eventMode ? 'Stream Name' : 'Room Name';
  },
  [createRoomInputPlaceholderText]: 'The Annual Galactic Meet',
  [createRoomMakeEveryOneCoHost]: 'Make everyone a Co-Host',
  [createRoomMakeEveryOneCoHostTooltipText]:
    'Turning on will give everyone the control of this room',
  [createRoomAllowPhoneNumberJoining]: 'Allow joining via a phone number',
  [createRoomAllowPhoneNumberJoiningTooltipText]:
    'Attendees can dial a number and join via PSTN',
  [createRoomBtnText]: ({ eventMode, audioRoom }) => {
    if (audioRoom) {
      return eventMode ? 'CREATE A AUDIO LIVECAST' : 'CREATE A VOICE CHAT';
    }
    return eventMode ? 'CREATE A STREAM' : 'CREATE A ROOM';
  },
  [createRoomJoinWithID]: 'Join with a room ID',
  [createRoomSuccessToastHeading]: (meetingName: string) =>
    `${meetingName} has been created`,
  [createRoomSuccessToastSubHeading]: 'Your New room is now live',
  [createRoomErrorToastHeading]: 'Something went wrong',
  [createRoomErrorToastSubHeading]: 'Room could not be created',
  [createRoomMadeByLabel]: 'Made with ❤️ by Asil Shaikh',
};
