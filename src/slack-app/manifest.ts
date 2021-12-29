import * as nodeUrl from 'url';
import { Stack, Token } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

/**
 * Properties for a Slack app manifest
 *
 * @see https://api.slack.com/reference/manifests
 */
export interface SlackAppManifestProps {
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

  /**
   * The major version of the manifest schema to target.
   *
   * @default - do not target a specific major version
   */
  readonly majorVersion?: number;

  /**
   * The minor version of the manifest schema to target
   *
   * @default - do not target a specific minor version
   */
  readonly minorVersion?: number;

  /**
   * An array of IP addresses that conform to the Allowed IP Ranges feature
   *
   * @see https://api.slack.com/authentication/best-practices#ip_allowlisting
   */
  readonly allowedIpAddressRanges?: string[];

  /**
   * Events API configuration for the app
   *
   * @see https://api.slack.com/events-api
   */
  readonly eventSubscriptions?: SlackAppManifestEventSubscriptions;

  /**
   * Interactivity configuration for the app
   */
  readonly interactivity?: SlackAppManifestInteractivity;

  /**
   * Whether org-wide deploy is enabled.
   *
   * @see https://api.slack.com/enterprise/apps
   *
   * @default false
   */
  readonly orgDeploy?: boolean;

  /**
   * Whether Socket Mode is enabled
   *
   * @see https://api.slack.com/apis/connections/socket
   *
   * @default false
   */
  readonly socketMode?: boolean;

  /**
   * App Home configuration
   *
   * @see https://api.slack.com/surfaces/tabs
   */
  readonly appHome?: SlackAppManifestAppHome;

  /**
   * Bot user configuration
   *
   * @see https://api.slack.com/bot-users
   */
  readonly botUser?: SlackkAppManifestBotUser;

  /**
   * Shortcuts configuration.
   *
   * A maximum of 5 shortcuts can be included.
   *
   * @see https://api.slack.com/interactivity/shortcuts
   */
  readonly shortcuts?: SlackAppManifestShortcut[];

  /**
   * Slash commands configuration.
   *
   * A maximum of 5 slash commands can be included.
   *
   * @see https://api.slack.com/interactivity/slash-commands
   */
  readonly slashCommands?: SlackAppManifestSlashCommand[];

  /**
   * Workflow steps.
   *
   * A maximum of 10 workflow steps can be included.
   *
   * @see https://api.slack.com/workflows/steps
   */
  readonly workflowSteps?: SlackAppManifestWorkflowStep[];

  /**
   * Valid unfurl domains to register.
   *
   * A maximum of 5 unfurl domains can be included.
   *
   * @see https://api.slack.com/reference/messaging/link-unfurling#configuring_domains
   */
  readonly unfurlDomains?: string[];

  /**
   * OAuth configuration for the app
   */
  readonly oauthConfig?: SlackAppManifestOauthConfig;
}

/**
 * Settings section of the app config pages
 */
export interface SlackAppManifestSettings {
  /**
   * An array of IP addresses that conform to the Allowed IP Ranges feature
   *
   * @see https://api.slack.com/authentication/best-practices#ip_allowlisting
   */
  readonly allowedIpAddressRanges?: string[];

  /**
   * Events API configuration for the app
   *
   * @see https://api.slack.com/events-api
   */
  readonly eventSubscriptions?: SlackAppManifestEventSubscriptions;

  /**
   * Interactivity configuration for the app
   */
  readonly interactivity?: SlackAppManifestInteractivity;

  /**
   * Whether org-wide deploy is enabled.
   *
   * @see https://api.slack.com/enterprise/apps
   *
   * @default false
   */
  readonly orgDeploy?: boolean;

  /**
   * Whether Socket Mode is enabled
   *
   * @see https://api.slack.com/apis/connections/socket
   *
   * @default false
   */
  readonly socketMode?: boolean;
}

/**
 * Events API configuration for the app
 *
 * @see https://api.slack.com/events-api
 */
export interface SlackAppManifestEventSubscriptions {
  /**
   * The full https URL that acts as the Events API request URL
   *
   * @see https://api.slack.com/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls
   */
  readonly requestUrl: string;

  /**
   * Event types you want the app to subscribe to.
   *
   * A maximum of 100 event types can be used
   *
   * @see https://api.slack.com/events
   */
  readonly botEvents?: string[];

  /**
   * Event types you want the app to subscribe to on behalf of authorized users.
   *
   * A maximum of 100 event types can be used.
   */
  readonly userEvents?: string[];
}

/**
 * Interactivity configuration for the app
 *
 * @see https://api.slack.com/interactivity/handling#setup
 */
export interface SlackAppManifestInteractivity {
  /**
   * Whether or not interactivity features are enabled
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The full https URL that acts as the interactive Request URL
   */
  readonly requestUrl?: string;

  /**
   * The full https URL that acts as th interactive Options Load URL
   */
  readonly messageMenuOptionsUrl?: string;
}

/**
 * App Home configuration
 *
 * @see https://api.slack.com/surfaces/tabs
 */
export interface SlackAppManifestAppHome {
  /**
   * Wether the Home tab is enabled
   *
   * @default false
   */
  readonly homeTab?: boolean;

  /**
   * Wether the Messages is enabled
   *
   * @default false
   */
  readonly messagesTab?: boolean;

  /**
   * Whether the users can send messages to your app in the
   * Messages tab of your App Home
   *
   * @default false
   */
  readonly messagesTabReadOnly?: boolean;
}

/**
 * Bot user configuration
 *
 * @see https://api.slack.com/bot-users
 */
export interface SlackkAppManifestBotUser {
  /**
   * The display name of the bot user.
   *
   * Maximum length is 80 characters.
   */
  readonly displayName: string;

  /**
   * Whether the bot user will always appear to be online
   *
   * @default false
   */
  readonly alwaysOnline?: boolean;
}

/**
 * Shortcut configuration
 *
 * @see https://api.slack.com/interactivity/shortcuts
 */
export interface SlackAppManifestShortcut {
  /**
   * The name of the shortcut
   */
  readonly name: string;

  /**
   * The type of shortcut
   *
   * @see https://api.slack.com/interactivity/shortcuts
   */
  readonly type: SlackAppManifestShortcutType;

  /**
   * The callback ID of the shortcut.
   *
   * Maximum length is 255 characters.
   */
  readonly callbackId: string;

  /**
   * A short description of the shortcut
   *
   * Maximum length is 150 characters
   */
  readonly description: string;
}

/**
 * Type of shortcuts
 *
 * @see https://api.slack.com/interactivity/shortcuts
 */
export enum SlackAppManifestShortcutType {
  /**
   * Message shortcuts are shown to users in the context menus of messages within Slack
   *
   * @see https://api.slack.com/interactivity/shortcuts/using#message_shortcuts
   */
  MESSAGE = 'message',

  /**
   * Global shortcuts are available to users via the shortcuts button in the composer,
   * and when using search in Slack
   *
   * @see https://api.slack.com/interactivity/shortcuts/using#global_shortcuts
   */
  GLOBAL = 'global',
}

/**
 * Slash command configuration
 *
 * @see https://api.slack.com/interactivity/slash-commands
 */
export interface SlackAppManifestSlashCommand {
  /**
   * The actual slash command.
   *
   * Maximum length is 32 characters
   */
  readonly command: string;

  /**
   * The description of the slash command.
   *
   * Maximum length is 2000 characters.
   */
  readonly description: string;

  /**
   * The full https URL that acts as the slash command's request URL
   *
   * @see https://api.slack.com/interactivity/slash-commands#creating_commands
   */
  readonly url?: string;

  /**
   * The short usage hint about the slash command for users.
   *
   * Maximum length is 1000 characters.
   */
  readonly usageHint?: string;

  /**
   * Whether channels, users, and links typed with the slash command should be escaped
   *
   * @default false
   */
  readonly shouldEscape?: boolean;
}

/**
 * Workflow step
 *
 * @see https://api.slack.com/workflows/steps
 */
export interface SlackAppManifestWorkflowStep {
  /**
   * The name of the workflow step.
   *
   * Maximum length of 50 characters.
   */
  readonly name: string;

  /**
   * The callback ID of the workflow step.
   *
   * Maximum length of 50 characters.
   */
  readonly callbackId: string;
};

/**
 * OAuth configuration for the app
 */
export interface SlackAppManifestOauthConfig {
  /**
   * OAuth redirect URLs
   *
   * A maximum of 1000 redirect URLs can be included.
   *
   * @see https://api.slack.com/authentication/oauth-v2#redirect_urls
   */
  readonly redirectUrls?: string[];

  /**
   * Bot scopes to request upon app installation.
   *
   * A maximum of 255 scopes can be included.
   *
   * @see https://api.slack.com/scopes
   */
  readonly botScopes?: string[];

  /**
   * User scopes to request upon app installation.
   *
   * A maximum of 255 scopes can be included.
   *
   * @see https://api.slack.com/scopes
   */
  readonly userScopes?: string[];
}


/**
 * A Slack app manifest
 *
 * @see https://api.slack.com/reference/manifests
 */
export class SlackAppManifest {
  constructor(private readonly props: SlackAppManifestProps) {
    validateLength('app name', 35, props.name);
    validateLength('app description', 140, props.description);
    validateLength('app long description', 4000, props.longDescription);
    validateColor(props.backgroundColor);

    validateUrl(props.eventSubscriptions?.requestUrl);
    validateItems('bot events', 100, props.eventSubscriptions?.botEvents);
    validateItems('users events', 100, props.eventSubscriptions?.userEvents);

    validateUrl(props.interactivity?.requestUrl);
    validateUrl(props.interactivity?.messageMenuOptionsUrl);
    validateLength('bot display name', 80, props.botUser?.displayName);

    validateItems('shortcuts', 5, props.shortcuts);
    props.shortcuts?.forEach((shortcut) => {
      validateLength('shortcut callback ID', 255, shortcut.callbackId);
      validateLength('shortcut description', 150, shortcut.description);
    });

    validateItems('slash commands', 5, props.slashCommands);
    props.slashCommands?.forEach((command) => {
      validateLength('slash command', 32, command.command);
      validateLength('slash command description', 2000, command.description),
      validateUrl(command.url);
      validateLength('slash command use hint', 1000, command.usageHint);
    });

    validateItems('workflow steps', 10, props.workflowSteps);
    props.workflowSteps?.forEach((step) => {
      validateLength('workflow step name', 50, step.name);
      validateLength('workflow step callback ID', 50, step.callbackId);
    });

    validateItems('unfurls domains', 5, props.unfurlDomains);

    validateItems('OAuth redirect URLs', 1000, props.oauthConfig?.redirectUrls);
    props.oauthConfig?.redirectUrls?.forEach((url) => {
      validateUrl(url, false);
    });
    validateItems('bot scopes', 255, props.oauthConfig?.botScopes);
    validateItems('user scopes', 255, props.oauthConfig?.userScopes);
  }

  public render(construct: IConstruct): string {
    const schema: SlackAppManifestSchema = {
      _metadata: {
        major_version: this.props.majorVersion,
        minor_version: this.props.minorVersion,
      },
      display_information: {
        name: this.props.name,
        description: this.props.description,
        long_description: this.props.longDescription,
        background_color: prefixWith('#', this.props.backgroundColor)?.toLowerCase(),
      },
      settings: {
        allowed_ip_address_ranges: this.props.allowedIpAddressRanges,
        event_subscriptions: {
          request_url: this.props.eventSubscriptions?.requestUrl,
          bot_events: this.props.eventSubscriptions?.botEvents,
          user_events: this.props.eventSubscriptions?.userEvents,
        },
        interactivity: this.props.interactivity
          ? {
            is_enabled: this.props.interactivity?.enabled ?? true,
            request_url: this.props.interactivity?.requestUrl,
            message_menu_options_url: this.props.interactivity?.messageMenuOptionsUrl,
          }
          : undefined,
        org_deploy_enabled: this.props.orgDeploy,
        socket_mode_enabled: this.props.socketMode,
      },
      features: {
        app_home: {
          home_tab_enabled: this.props.appHome?.homeTab,
          messages_tab_enabled: this.props.appHome?.messagesTab,
          messages_tab_read_only_enabled: this.props.appHome?.messagesTabReadOnly,
        },
        bot_user: this.props.botUser
          ? {
            display_name: this.props.botUser?.displayName,
            always_online: this.props.botUser?.alwaysOnline,
          }
          : undefined,
        shortcuts: this.props.shortcuts?.map((shortcut) => ({
          name: shortcut.name,
          type: shortcut.type,
          callback_id: shortcut.callbackId,
          description: shortcut.description,
        })),
        slash_commands: this.props.slashCommands?.map((command) => ({
          command: prefixWith('/', command.command),
          description: command.description,
          url: command.url,
          usage_hint: command.usageHint,
          should_escape: command.shouldEscape,
        })),
        workflow_steps: this.props.workflowSteps?.map((step) => ({
          name: step.name,
          callback_id: step.callbackId,
        })),
        unfurl_domains: this.props.unfurlDomains,
      },
      oauth_config: {
        redirect_urls: this.props.oauthConfig?.redirectUrls,
        scopes: {
          bot: this.props.oauthConfig?.botScopes,
          users: this.props.oauthConfig?.userScopes,
        },
      },
    };

    return Stack.of(construct).toJsonString(removeUndefined(schema));
  }
}

interface SlackAppManifestSchema {
  _metadata?: {
    major_version?: number;
    minor_version?: number;
  };
  display_information: {
    name: string;
    description?: string;
    long_description?: string;
    background_color?: string;
  };
  settings?: {
    allowed_ip_address_ranges?: string[];
    event_subscriptions?: {
      request_url?: string;
      bot_events?: string[];
      user_events?: string[];
    };
    interactivity?: {
      is_enabled: boolean;
      request_url?: string;
      message_menu_options_url?: string;
    };
    org_deploy_enabled?: boolean;
    socket_mode_enabled?: boolean;
  };
  features?: {
    app_home?: {
      home_tab_enabled?: boolean;
      messages_tab_enabled?: boolean;
      messages_tab_read_only_enabled?: boolean;
    };
    bot_user?: {
      display_name: string;
      always_online?: boolean;
    };
    shortcuts?: {
      name: string;
      type: string;
      callback_id: string;
      description: string;
    }[];
    slash_commands?: {
      command: string;
      description: string;
      url?: string;
      usage_hint?: string;
      should_escape?: boolean;
    }[];
    workflow_steps?: {
      name: string;
      callback_id: string;
    }[];
    unfurl_domains?: string[];
  };
  oauth_config?: {
    redirect_urls?: string[];
    scopes?: {
      bot?: string[];
      users?: string[];
    };
  };
}

function prefixWith<T extends string | undefined>(prefix: string, string: T): T {
  if (!string) {
    return undefined as T;
  }

  if (string.startsWith(prefix)) {
    return string;
  }

  return `${prefix}${string}` as T;
}

function validateLength(description: string, max: number, xs?: string): void {
  if (xs && !Token.isUnresolved(xs) && xs.length > max) {
    throw new Error(`Maximum length for ${description} is ${max}, got ${xs.length}: ${xs}`);
  }
}

function validateItems<T>(description: string, max: number, xs?: T[]): void {
  if (xs && !Token.isUnresolved(xs) && xs.length > max) {
    throw new Error(`Maximum number of items for ${description} is ${max}, got ${xs.length}`);
  }
}

function validateColor(color?: string): void {
  if (color && !Token.isUnresolved(color) && !/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    throw new Error(`Invalid hex color: ${color}`);
  }
}

function validateUrl(url?: string, https = true): void {
  if (url && !Token.isUnresolved(url)) {
    try {
      const parsed = new nodeUrl.URL(url);
      if (https && parsed.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch (err) {
      throw new Error(`${url} is not a valid${https ? ' HTTPS' : ''} url`);
    }
  }
}

function removeUndefined(obj: any): any {
  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const ret = obj
      .map(v => (v && typeof v === 'object') ? removeUndefined(v) : v)
      .filter(v => !(v == null));
    return ret.length !== 0 ? ret : undefined;
  }

  const ret = Object.entries(obj)
    .map(([k, v]) => [k, v && typeof v === 'object' ? removeUndefined(v) : v])
    .reduce((a: any, [k, v]) => (v == null ? a : (a[k]=v, a)), {});
  return Object.keys(ret).length !== 0 ? ret : undefined;
}
