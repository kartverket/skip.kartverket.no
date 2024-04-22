import posthog from 'posthog-js';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  posthog.init(
    'phc_KbdMwEhPTqiNfgORMYvLCE8QvySvPXMjVvdU1d86Gmi',
    {
      api_host: 'https://eu.posthog.com',
      persistence: 'memory', 
    },
  );
}
