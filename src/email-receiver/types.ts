// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-notifications-contents.html

export interface Verdict {
  status: 'PASS' | 'FAIL' | 'GRAY' | 'PROCESSING_FAILED';
}

export interface ScanVerdict {
  status: 'PASS' | 'FAIL' | 'GRAY' | 'PROCESSING_FAILED' | 'DISABLED';
}

export interface Header {
  name: string;
  value: string;
}

export interface SESMessage {
  notificationType: 'Received';
  receipt: {
    action: {
      type: 'S3';
      topicArn: string;
      bucketName: string;
      objectKey: string;
    };
    dkimVerdict: Verdict;
    dmarcPolicy?: 'none' | 'quarantine' | 'reject';
    dmarcVerdict: Verdict;
    processingTimeMillis: number;
    recipients: string[];
    spamVerdict: ScanVerdict;
    spfVerdict: Verdict;
    timestamp: string;
    virusVerdict: ScanVerdict;
  };
  mail: {
    destination: string[];
    messageId: string;
    source: string;
    headers: Header[];
    commonHeaders: {
      messageId: string;
      date: string;
      to?: string[];
      cc?: string[];
      bcc?: string[];
      from?: string[];
      sender?: string;
      returnPath: string;
      'reply-to'?: string[];
      subject?: string;
    };
  };
}

export interface SESEventRecord {
  eventSource: 'aws:ses';
  eventVersion: '1.0';
  ses: SESMessage;
}

export interface SESEvent {
  Records: SESEventRecord[];
}
