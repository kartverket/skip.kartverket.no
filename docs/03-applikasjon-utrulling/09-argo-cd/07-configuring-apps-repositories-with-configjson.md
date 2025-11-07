# Configuring apps repositories with config.json

Using [Argo CD](index.md) to deploy and dynamically set up new environments by adding new directories in your [apps-repo](02-hva-er-et-apps-repo.md) is a super convenient way to spin up new test environments, but it also introduces some challenges. Since projects in Argo CD are dynamically created as new directories in your apps repo are discovered, the settings on those projects have until now been pre-defined by SKIP. This gives you sane default behaviours like auto sync enabled on dev but not on prod and generally no good ways to change that behaviour.

It’s possible to configure the settings of a directory within your apps-repo by adding a special file called `config.json` . When this file is present, a set of pre-defined options can be provided to configure the way that directory is synced by Argo CD.

The below example of a `config.json` file enables automatic syncing of the directory that it resides in.

```javascript
{
  "tool": "directory",
  "autoSync": true
}
```

Only placement in root directories of namespaces are supported. For example `dev/foo-main/config.json` or `env/atkv3-dev/foo-main/config.json` .

No special action is needed after the file is added to a directory in the apps repo. Argo CD will locate it automatically and update the project settings accordingly.

## Supported options

| **Key**           | **Type**                           | **Description**                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tool` (required) | `directory` / `kustomize` / `helm` | Which tool should Argo CD use to sync this directory? The “Directory” option supports yaml and jsonnet files. See also [tools](https://argo-cd.readthedocs.io/en/latest/user-guide/application_sources/) .                                                                                                                                           |
| `autoSync`        | boolean ( `true` / `false` )       | When set to `true` , the directory is automatically synced when changes are detected. The default value is `true` in dev and `false` in prod.                                                                                                                                                                                                        |
| `prune`           | boolean ( `true` / `false` )       | When enabled, Argo CD will automatically remove resouces that are no longer present in Git. Default is `true` . See [prune](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning) . Only used when `autoSync` is `true`                                                                                                  |
| `allowEmpty`      | boolean ( `true` / `false` )       | Safety mechanism. When `prune` is enabled it deletes resources automatically, but it will not allow empty syncs (delete all) unless `allowEmpty` also is enabled. Default is `false` . See [allowEmpty](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning-with-allow-empty-v18) . Only used when `autoSync` is `true` |
| `selfHeal`        | boolean ( `true` / `false` )       | When changes are made on the cluster directly, Argo will not revert them unless `selfHeal` is provided. Default is `true` . See [self heal](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-self-healing) . Only used when `autoSync` is `true`                                                                             |
