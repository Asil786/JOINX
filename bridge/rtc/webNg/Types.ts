 

export interface RtcEngineContext {
  appId?: string;
}

export enum RenderModeType {
  /**
   * 1: Hidden mode. Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). One dimension of the video may have clipped contents.
   */
  RenderModeHidden = 1,
  /**
   * 2: Fit mode. Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Areas that are not filled due to disparity in the aspect ratio are filled with black.
   */
  RenderModeFit = 2,
  /**
   * @ignore
   */
  RenderModeAdaptive = 3,
}

export enum VideoMirrorMode {
  /**
   * 0: (Default) The SDK determines the mirror mode.
   */
  Auto = 0,
  /**
   * 1: Enables mirror mode.
   */
  Enabled = 1,
  /**
   * 2: Disables mirror mode.
   */
  Disabled = 2,
}
/**
 *
 * The latency level of an audience member in a live interactive streaming. Takes effect only when the user role is `"audience"`.
 * - `1`: Low latency.
 * - `2`: (Default) Ultra low latency.
 */

export const enum AudienceLatencyLevelType {
  /**
   * Low latency.
   */
  AUDIENCE_LEVEL_LOW_LATENCY = 1,
  /**
   * Ultra-low latency.
   */
  AUDIENCE_LEVEL_ULTRA_LOW_LATENCY = 2,
  /**
   * @ignore
   */
  AUDIENCE_LEVEL_SYNC_LATENCY = 3,
}

export interface ClientRoleOptions {
  /**
   * The latency level of an audience member in a live interactive streaming.
   *
   * > Note:
   * > - Takes effect only when the user role is `"audience"`.
   * > - Levels affect prices.
   */
  level: AudienceLatencyLevelType;
}

/* User role for live streaming mode */
export enum role {
  /* 1: A host can both send and receive streams. */
  host = 'host',
  /* 2: The default role. An audience can only receive streams.*/
  audience = 'audience',
}

/* Mode for RTC (Live or Broadcast)*/
export enum mode {
  /**
   * 0: (Default) The Communication profile.
   * Use this profile in one-on-one calls or group calls, where all users can talk freely.
   */
  live = 'live',
  /**
   * 1: The Live-Broadcast profile.
   * Users in a live-broadcast channel have a role as either host or audience. A host can both send and receive streams; an audience can only receive streams.
   */
  rtc = 'rtc',
}
