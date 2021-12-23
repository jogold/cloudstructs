/**
 * Properties for a Slack app manifest
 */
export interface SlackAppManifestProps {
  /**
   * A group of settings that describe the manifest
   *
   * @default - no specific manifest schema version to target
   */
  readonly metadata?: SlackAppManifestMetadata;

  /**
   * A group of settings that describe parts of an app's appearance within Slack.
   *
   * If you're distributing the app via the App Directory, read the
   * [listing guidelines](https://api.slack.com/start/distributing/guidelines#listing)
   * to pick the best values for these settings.
   */
  readonly displayInformation: SlackAppManifestDisplayInformation;

  /**
   * A group of settings corresponding to the Settings section of the app config pages
   */
  readonly settings?: SlackAppManifestSettings;
}

/**
 * A group of settings that describe parts of an app's appearance within Slack.
 */
export interface SlackAppManifestMetadata {
  /**
   * An integer that specifies the major version of the manifest schema to target.
   */
  readonly majorVersion?: number;

  /**
   * An integer that specifies the minor version of the manifest schema to target
   */
  readonly minorVersion?: number;
}

/**
 * A group of settings that describe parts of an app's appearance within Slack
 */
export interface SlackAppManifestDisplayInformation {
  /**
   * The name of the app.
   *
   * Maximum length is 35 characters.
   */
  readonly name: string;

  /**
   * A short description of the app for display to users.
   *
   * Maximum length is 140 characters.
   *
   * @default - no short description
   */
  readonly description?: string;

  /**
   * A longer version of the description of the app.
   *
   * Maximum length is 4000 characters.
   */
  readonly longDescription?: string;

  /**
   * A hex color value that specifies the background color used on hovercards
   * that display information about your app.
   *
   * Can be 3-digit (#000) or 6-digit (#000000) hex values with or without #
   */
  readonly backgroundColor?: string;
}

/**
 * A group of settings corresponding to the Settings section of the app config pages
 */
export interface SlackAppManifestSettings {
  /**
   * An array of IP addresses that conform to the
   * [Allowed IP Ranges feature](https://api.slack.com/authentication/best-practices#ip_allowlisting)
   */
  readonly allowedIpAddressRanges?: string[];

  /**
   * [Events API](https://api.slack.com/events-api) configuration for the app
   */
  readonly eventSubscriptions?: SlackAppManifestEventSubscriptions;

  /**
   * Interactivity configuration for the app
   */
  readonly interactivity?: SlackAppManifestInteractivity;

  /**
   * Whether or not [org-wide deploy](https://api.slack.com/enterprise/apps) is enabled.
   *
   * @default false
   */
  readonly orgDeployEnabled?: boolean;
}

/**
 * [Events API](https://api.slack.com/events-api) configuration for the app
 */
export interface SlackAppManifestEventSubscriptions {
  /**
   * The full https URL that acts as the
   * [Events API request URL](https://api.slack.com/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls)
   */
  readonly requestUrl: string;

  /**
   * An array of [event types](https://api.slack.com/events) you want the
   * app to subscribe to.
   *
   * A maximum of 100 event types can be used
   */
  readonly botEvents?: string[];

  /**
   * An array of event types you want the app to subscribe to on behalf of authorized users.
   *
   * A maximum of 100 event types can be used.
   */
  readonly userEvents?: string[];
}

/**
 * Interactivity configuration for the app
 */
export interface SlackAppManifestInteractivity {
  /**
   * Whether or not interactivity features are enabled
   *
   * @default true
   */
  readonly isEnabled?: boolean;

  /**
   * The full https URL that acts as the
   * [interactive Request URL](https://api.slack.com/interactivity/handling#setup)
   */
  readonly requestUrl?: string;

  /**
   * The full https URL that acts as the
   * [interactive Options Load URL](https://api.slack.com/interactivity/handling#setup)
   */
  readonly messageMenuOptionsUrl?: string;
}

/**
 * A Slack app manifest
 */
export class SlackAppManifest {

}
