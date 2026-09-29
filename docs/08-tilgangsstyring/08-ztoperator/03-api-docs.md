# API Reference

## Packages

| Package | Resource types |
| --- | --- |
| `ztoperator.kartverket.no/v1alpha1` | [AuthPolicy](#authpolicy)<br/> |


## Package `ztoperator.kartverket.no/v1alpha1`

Resource types in this package:

- [AuthPolicy](#authpolicy)



<a id="authpolicy"></a>
### AuthPolicy

| Field | Value |
| --- | --- |
| Package | `ztoperator.kartverket.no/v1alpha1` |
| API version | `ztoperator.kartverket.no/v1alpha1` |
| Kind | `AuthPolicy` |

AuthPolicy is the Schema for the authpolicies API.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
      <td><b>apiVersion</b></td>
      <td>string</td>
      <td>ztoperator.kartverket.no/v1alpha1</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b>kind</b></td>
      <td>string</td>
      <td>AuthPolicy</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#objectmeta-v1-meta">metadata</a></b></td>
      <td>object</td>
      <td>Refer to the Kubernetes API documentation for the fields of the `metadata` field.</td>
      <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspec">spec</a></b></td>
        <td>object</td>
        <td>
          AuthPolicySpec defines the desired state of AuthPolicy.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicystatus">status</a></b></td>
        <td>object</td>
        <td>
          AuthPolicyStatus defines the observed state of AuthPolicy.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspec"></a>
#### AuthPolicy.spec

<sup>[Parent](#authpolicy)</sup>

AuthPolicySpec defines the desired state of AuthPolicy.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>enabled</b></td>
        <td>boolean</td>
        <td>
          Whether to enable JWT validation.<br/>If enabled, incoming JWTs will be validated against the issuer specified in the app registration and the generated audience.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecselector">selector</a></b></td>
        <td>object</td>
        <td>
          The Selector specifies which workload the defined auth policy should be applied to.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>wellKnownURI</b></td>
        <td>string</td>
        <td>
          WellKnownURI specifies the URi to the identity provider&#39;s discovery document (also known as well-known endpoint).<br/>The value must be a well-formed http or https URL.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>acceptedResources</b></td>
        <td>[]string</td>
        <td>
          AcceptedResources specifies resource indicators used to request an audience limited access token following [RFC8707](https://datatracker.ietf.org/doc/html/rfc8707).<br/>It defines accepted audience resource indicators in the JWT token.<br/><br/>The resource indicators specified will be added to the initial authorize request towards the configured identity provider.<br/>Each resource indicator must be a valid URI,<br/>and the access token returned by the identity provider will set the resource indicators in the `aud` claim in the JWT token.<br/>If none of the specified resource indicators is present in the `aud` claim in the JWT, the request will be denied.<br/><br/>Please note that this alone is not sufficient to securely restrict access to a resource based on the `aud` claim.<br/>Use .allowedAudiences to specify one or more allowed client IDs.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecallowedaudiencesindex">allowedAudiences</a></b></td>
        <td>[]object</td>
        <td>
          AllowedAudiences defines the allowed audience (`aud`) values in the JWT.<br/>At least one of the listed audience values must be present in the token&#39;s `aud` claim for validation to succeed.<br/><br/>The normative behaviour for an OAuth / OIDC-compliant identity provider is to validate the presence of one or more client IDs as allowed audiences.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecauthrulesindex">authRules</a></b></td>
        <td>[]object</td>
        <td>
          AuthRules defines rules for allowing HTTP requests based on conditions<br/>that must be met based on JWT claims.<br/><br/>API endpoints not covered by AuthRules and/or IgnoreAuthRules requires an authenticated JWT by default.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecautologin">autoLogin</a></b></td>
        <td>object</td>
        <td>
          AutoLogin specifies the required configuration needed to log in users.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecbaselineauth">baselineAuth</a></b></td>
        <td>object</td>
        <td>
          BaselineAuth defines additional JWT authentication, beyond standard JWT verification.<br/>Baseline authentication applies to all combinations of paths and methods not explicitly ignored by .ignoreAuthRules.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>forwardJwt</b></td>
        <td>boolean</td>
        <td>
          If set to `true`, the original token will be kept for the upstream request. Defaults to `true`.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecignoreauthrulesindex">ignoreAuthRules</a></b></td>
        <td>[]object</td>
        <td>
          IgnoreAuthRules defines request matchers for HTTP requests that do not require JWT authentication.<br/><br/>API endpoints not covered by AuthRules or IgnoreAuthRules require an authenticated JWT by default.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecoauthcredentials">oAuthCredentials</a></b></td>
        <td>object</td>
        <td>
          OAuthCredentials specifies a reference to a kubernetes secret in the same namespace holding OAuth credentials used for authentication.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecoutputclaimtoheadersindex">outputClaimToHeaders</a></b></td>
        <td>[]object</td>
        <td>
          OutputClaimsToHeaders specifies a list of operations to copy the claim to HTTP headers on a successfully verified token.<br/>The header specified in each operation in the list must be unique. Nested claims of type string/int/bool is supported as well.<br/>If the claim is an object or array, it will be added to the header as a base64-encoded JSON string.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecselector"></a>
#### AuthPolicy.spec.selector

<sup>[Parent](#authpolicyspec)</sup>

The Selector specifies which workload the defined auth policy should be applied to.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>matchLabels</b></td>
        <td>map[string]string</td>
        <td>
          One or more labels that indicate a specific set of pods/VMs<br/>on which a policy should be applied. The scope of label search is restricted to<br/>the configuration namespace in which the resource is present.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecallowedaudiencesindex"></a>
#### AuthPolicy.spec.allowedAudiences[index]

<sup>[Parent](#authpolicyspec)</sup>

AllowedAudience defines an audience that is validated against the `aud` claim in the JWT.
An audience can be defined as a static value or retrieved from a kubernetes resource.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>value</b></td>
        <td>string</td>
        <td>
          Value specifies a static audience value.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecallowedaudiencesindexvaluefrom">valueFrom</a></b></td>
        <td>object</td>
        <td>
          ValueFrom specifies a reference to a kubernetes resource to retrieve the audience value from.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecallowedaudiencesindexvaluefrom"></a>
#### AuthPolicy.spec.allowedAudiences[index].valueFrom

<sup>[Parent](#authpolicyspecallowedaudiencesindex)</sup>

ValueFrom specifies a reference to a kubernetes resource to retrieve the audience value from.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b><a href="#authpolicyspecallowedaudiencesindexvaluefromconfigmapkeyref">configMapKeyRef</a></b></td>
        <td>object</td>
        <td>
          ConfigMapKeyRef specifies a reference to a key in a ConfigMap.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecallowedaudiencesindexvaluefromsecretkeyref">secretKeyRef</a></b></td>
        <td>object</td>
        <td>
          SecretKeyRef specifies a reference to a key in a Secret.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecallowedaudiencesindexvaluefromconfigmapkeyref"></a>
#### AuthPolicy.spec.allowedAudiences[index].valueFrom.configMapKeyRef

<sup>[Parent](#authpolicyspecallowedaudiencesindexvaluefrom)</sup>

ConfigMapKeyRef specifies a reference to a key in a ConfigMap.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key specifies the data entry name within the ConfigMap/Secret; must follow key naming rules.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name specifies the name of the ConfigMap/Secret; must satisfy DNS-1123 subdomain naming.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecallowedaudiencesindexvaluefromsecretkeyref"></a>
#### AuthPolicy.spec.allowedAudiences[index].valueFrom.secretKeyRef

<sup>[Parent](#authpolicyspecallowedaudiencesindexvaluefrom)</sup>

SecretKeyRef specifies a reference to a key in a Secret.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key specifies the data entry name within the ConfigMap/Secret; must follow key naming rules.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name specifies the name of the ConfigMap/Secret; must satisfy DNS-1123 subdomain naming.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecauthrulesindex"></a>
#### AuthPolicy.spec.authRules[index]

<sup>[Parent](#authpolicyspec)</sup>

RequestAuthRule defines a rule for controlling access to HTTP requests using JWT authentication.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>paths</b></td>
        <td>[]string</td>
        <td>
          Paths specify a set of URI paths that this rule applies to.<br/>Each path must be a valid URI path, starting with &#39;/&#39; and not ending with &#39;/&#39;.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>denyRedirect</b></td>
        <td>boolean</td>
        <td>
          DenyRedirect specifies whether a denied request should trigger auto-login (if configured) or not when it is denied due to missing or invalid authentication.<br/>Defaults to false, meaning auto-login will be triggered (if configured).<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>methods</b></td>
        <td>[]enum</td>
        <td>
          Methods specifies HTTP methods that applies for the defined paths.<br/>If omitted, all methods are permitted.<br/><br/>Allowed methods:<br/>- GET<br/>- POST<br/>- PUT<br/>- PATCH<br/>- DELETE<br/>- HEAD<br/>- OPTIONS<br/>- TRACE<br/>- CONNECT<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicyspecauthrulesindexwhenindex">when</a></b></td>
        <td>[]object</td>
        <td>
          When defines additional conditions based on JWT claims that must be met.<br/><br/>The request is permitted if all the specified conditions are satisfied.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecauthrulesindexwhenindex"></a>
#### AuthPolicy.spec.authRules[index].when[index]

<sup>[Parent](#authpolicyspecauthrulesindex)</sup>

Condition represents a rule that evaluates JWT claims to determine access control.

This type allows defining conditions that check whether a specific claim in
the JWT token contains one of the expected values.

If multiple conditions are specified, all must be met (AND logic) for the request to be allowed.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>claim</b></td>
        <td>string</td>
        <td>
          Claim specifies the name of the JWT claim to check.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values specifies a list of allowed values for the claim.<br/>If the claim in the JWT contains any of these values (OR logic), the condition is met.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecautologin"></a>
#### AuthPolicy.spec.autoLogin

<sup>[Parent](#authpolicyspec)</sup>

AutoLogin specifies the required configuration needed to log in users.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>enabled</b></td>
        <td>boolean</td>
        <td>
          Whether to enable auto login.<br/>If enabled, users accessing authenticated endpoints will be redirected to log in towards the configured identity provider.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>scopes</b></td>
        <td>[]string</td>
        <td>
          Scopes specifies the OAuth2 scopes used during authorization code flow.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>loginParams</b></td>
        <td>map[string]string</td>
        <td>
          LoginParams specifies a map of query parameters and their values which will be added in the authorize request made towards the configured identity provider.<br/>Keys must be valid OAuth parameter names (letters, digits, and underscores).<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>loginPath</b></td>
        <td>string</td>
        <td>
          LoginPath specifies a single path that triggers auto-login behavior.<br/>Auto-login is also triggered for endpoints that require authentication,<br/>unless the matching `authRules` entry sets `denyRedirect: true`.<br/>Requests matching this path will redirect unauthenticated users to log in.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>logoutPath</b></td>
        <td>string</td>
        <td>
          LogoutPath specifies which URI to redirect the user to when signing out.<br/>This will end the session for the application and also redirect the user<br/>to log out towards the configured identity provider (RP-initiated logout).<br/>If omitted, a default path of /logout is used.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>postLogoutRedirectUri</b></td>
        <td>string</td>
        <td>
          PostLogoutRedirectURI specifies which URI to redirect the user to after<br/>successfully signed out towards the configured identity provider (RP-initiated logout).<br/>If omitted, no post_logout_redirect_uri will be used.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>redirectPath</b></td>
        <td>string</td>
        <td>
          RedirectPath specifies which path to redirect the user to after completing the OIDC flow.<br/>If omitted, a default path of /oauth2/callback is used.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecbaselineauth"></a>
#### AuthPolicy.spec.baselineAuth

<sup>[Parent](#authpolicyspec)</sup>

BaselineAuth defines additional JWT authentication, beyond standard JWT verification.
Baseline authentication applies to all combinations of paths and methods not explicitly ignored by .ignoreAuthRules.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b><a href="#authpolicyspecbaselineauthclaimsindex">claims</a></b></td>
        <td>[]object</td>
        <td>
          Claims defines conditions based on JWT claims that must be met.<br/>These conditions are applied to all paths and methods not explicitly ignored in .ignoreAuthRules,<br/>including those covered by other specified AuthRules.<br/><br/>The request is permitted if all the specified conditions are satisfied.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecbaselineauthclaimsindex"></a>
#### AuthPolicy.spec.baselineAuth.claims[index]

<sup>[Parent](#authpolicyspecbaselineauth)</sup>

Condition represents a rule that evaluates JWT claims to determine access control.

This type allows defining conditions that check whether a specific claim in
the JWT token contains one of the expected values.

If multiple conditions are specified, all must be met (AND logic) for the request to be allowed.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>claim</b></td>
        <td>string</td>
        <td>
          Claim specifies the name of the JWT claim to check.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values specifies a list of allowed values for the claim.<br/>If the claim in the JWT contains any of these values (OR logic), the condition is met.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecignoreauthrulesindex"></a>
#### AuthPolicy.spec.ignoreAuthRules[index]

<sup>[Parent](#authpolicyspec)</sup>

RequestMatcher defines paths and methods to match incoming HTTP requests.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>paths</b></td>
        <td>[]string</td>
        <td>
          Paths specify a set of URI paths that this rule applies to.<br/>Each path must be a valid URI path, starting with &#39;/&#39; and not ending with &#39;/&#39;.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>methods</b></td>
        <td>[]enum</td>
        <td>
          Methods specifies HTTP methods that applies for the defined paths.<br/>If omitted, all methods are permitted.<br/><br/>Allowed methods:<br/>- GET<br/>- POST<br/>- PUT<br/>- PATCH<br/>- DELETE<br/>- HEAD<br/>- OPTIONS<br/>- TRACE<br/>- CONNECT<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecoauthcredentials"></a>
#### AuthPolicy.spec.oAuthCredentials

<sup>[Parent](#authpolicyspec)</sup>

OAuthCredentials specifies a reference to a kubernetes secret in the same namespace holding OAuth credentials used for authentication.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>clientIDKey</b></td>
        <td>string</td>
        <td>
          ClientIDKey specifies the data key to access the client ID.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>clientSecretKey</b></td>
        <td>string</td>
        <td>
          ClientSecretKey specifies the data key to access the client secret.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>secretRef</b></td>
        <td>string</td>
        <td>
          SecretRef specifies the name of the kubernetes secret.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicyspecoutputclaimtoheadersindex"></a>
#### AuthPolicy.spec.outputClaimToHeaders[index]

<sup>[Parent](#authpolicyspec)</sup>

ClaimToHeader specifies a list of operations to copy the claim to HTTP headers on a successfully verified token.
The header specified in each operation in the list must be unique. Nested claims of type string/int/bool is supported as well.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>claim</b></td>
        <td>string</td>
        <td>
          Claim specifies the name of the claim in the JWT token that will be copied to the header.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>header</b></td>
        <td>string</td>
        <td>
          Header specifies the name of the HTTP header to which the claim value will be copied.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="authpolicystatus"></a>
#### AuthPolicy.status

<sup>[Parent](#authpolicy)</sup>

AuthPolicyStatus defines the observed state of AuthPolicy.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>ready</b></td>
        <td>boolean</td>
        <td>
          <br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#authpolicystatusconditionsindex">conditions</a></b></td>
        <td>[]object</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>observedGeneration</b></td>
        <td>integer</td>
        <td>
          <br/>
          <br/>
            <i>Format</i>: int64<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>phase</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="authpolicystatusconditionsindex"></a>
#### AuthPolicy.status.conditions[index]

<sup>[Parent](#authpolicystatus)</sup>

Condition contains details for one aspect of the current state of this API Resource.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>lastTransitionTime</b></td>
        <td>string</td>
        <td>
          lastTransitionTime is the last time the condition transitioned from one status to another.<br/>This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.<br/>
          <br/>
            <i>Format</i>: date-time<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          message is a human readable message indicating details about the transition.<br/>This may be an empty string.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>reason</b></td>
        <td>string</td>
        <td>
          reason contains a programmatic identifier indicating the reason for the condition&#39;s last transition.<br/>Producers of specific condition types may define expected values and meanings for this field,<br/>and whether the values are considered a guaranteed API.<br/>The value should be a CamelCase string.<br/>This field may not be empty.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>status</b></td>
        <td>enum</td>
        <td>
          status of the condition, one of True, False, Unknown.<br/>
          <br/>
            <i>Enum</i>: True, False, Unknown<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>type</b></td>
        <td>string</td>
        <td>
          type of condition in CamelCase or in foo.example.com/CamelCase.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>observedGeneration</b></td>
        <td>integer</td>
        <td>
          observedGeneration represents the .metadata.generation that the condition was set based upon.<br/>For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date<br/>with respect to the current state of the instance.<br/>
          <br/>
            <i>Format</i>: int64<br/>
            <i>Minimum</i>: 0<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>