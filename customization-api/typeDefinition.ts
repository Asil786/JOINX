 
import React from 'react';
export type {ChatBubbleProps} from '../src/components/ChatContext';
import {ChatBubbleProps} from '../src/components/ChatContext';
import {ContentStateInterface} from '../agora-rn-uikit';
import {I18nInterface} from '../src/language/i18nTypes';
import {ToolbarPresetProps} from './sub-components';
import {TextDataInterface} from '../src/language/default-labels';
import {VBPanelProps} from '../src/components/virtual-background/VBPanel';
import {AIAgentState} from '../src/ai-agent/components/AgentControls/const';

export const CUSTOM_ROUTES_PREFIX = '/r/';

interface BeforeAndAfterInterface {
  // commented for v1 release
  // before?: React.ComponentType;
  // after?: React.ComponentType;
}

export interface PreCallInterface extends BeforeAndAfterInterface {
  preview?: React.ComponentType;
  audioMute?: React.ComponentType;
  videoMute?: React.ComponentType;
  meetingName?: React.ComponentType;
  deviceSelect?: React.ComponentType;
  joinButton?: React.ComponentType;
  textBox?: React.ComponentType;
  virtualBackgroundPanel?: React.ComponentType<VBPanelProps>;
  wrapper?: React.ComponentType;
}
export interface ChatCmpInterface {
  //commented for v1 release
  //extends BeforeAndAfterInterface
  chatBubble?: React.ComponentType<ChatBubbleProps>;
  chatInput?: React.ComponentType;
}

export type LayoutComponent = React.ComponentType<{
  renderData: ContentStateInterface['activeUids'];
}>;

export interface SidePanelItem {
  name: string;
  title: string;
  component: React.ComponentType;
  onClose?: () => void;
}

export interface LayoutItem {
  name: string;
  label: string;
  translationKey?: keyof TextDataInterface;
  icon: string;
  component: LayoutComponent;
}

export type ToolbarType = React.ComponentType | ToolbarPresetProps['items'];
export type CustomLogger = (
  message: string,
  data: any,
  type: 'debug' | 'error' | 'info' | 'warn',
) => void;

export interface CustomAgentInterfaceProps {
  connectionState: AIAgentState;
}
export interface VideoCallInterface extends BeforeAndAfterInterface {
  // commented for v1 release
  topToolBar?: ToolbarType;
  bottomToolBar?: ToolbarType;
  leftToolBar?: ToolbarType;
  rightToolBar?: ToolbarType;
  //settingsPanel?: React.ComponentType;
  participantsPanel?: React.ComponentType;
  chat?: ChatCmpInterface;
  captionPanel?: React.ComponentType;
  transcriptPanel?: React.ComponentType;
  virtualBackgroundPanel?: React.ComponentType<VBPanelProps>;
  customLayout?: (layouts: LayoutItem[]) => LayoutItem[];
  wrapper?: React.ComponentType;
  customAgentInterface?: React.ComponentType<CustomAgentInterfaceProps>;
  customSidePanel?: () => SidePanelItem[];
  invitePopup?: {
    title: string;
    renderComponent?: React.ComponentType;
  };
  hostControls?: {
    audioControl?: React.ComponentType;
    videoControl?: React.ComponentType;
  };
}

export type ComponentsInterface = {
  /**
   * Custom context/api provider wrapped in root level
   */
  appRoot?: React.ComponentType;
  // commented for v1 release
  precall?: PreCallInterface;
  preferenceWrapper?: React.ComponentType;
  //precall?: React.ComponentType;
  create?: React.ComponentType;
  //share?: React.ComponentType;
  //join?: React.ComponentType;
  videoCall?: VideoCallInterface;
};

export interface CustomRoutesInterface {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  componentProps?: object;
  isPrivateRoute?: boolean;
  routeProps?: object;
  failureRedirectTo?: string;
  isTopLevelRoute?: boolean;
}

export type CustomHookType = () => () => Promise<void>;
export type EndCallHookType = () => (
  isHost: boolean,
  history: History,
) => Promise<void>;

export interface AppConfig {
  defaultRootFallback?: React.ComponentType;
}

export interface CustomizationApiInterface {
  /**
   * components used to replace whole screen or subcomponents
   */
  components?: ComponentsInterface;
  /**
   * custom routes used to add new page/routes
   */
  // commented for v1 release
  customRoutes?: CustomRoutesInterface[];
  /**
   * app config
   */
  config?: AppConfig;
  /**
   * Internationlization
   */
  i18n?: I18nInterface[];
  /**
   * Custom logger
   */
  logger?: CustomLogger;
  /**
   * Life cycle events
   */
  // commented for v1 release
  lifecycle?: {
    useAfterEndCall?: EndCallHookType;
    useBeforeEndCall?: EndCallHookType;
    // useBeforeJoin?: CustomHookType;
    // useBeforeCreate?: CustomHookType;
  };
}
