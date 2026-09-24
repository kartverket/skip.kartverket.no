# API Reference

## Packages

| Package | Resource types |
| --- | --- |
| `accesserator.kartverket.no/v1alpha` | [SecurityConfig](#securityconfig)<br/> |


## Package `accesserator.kartverket.no/v1alpha`

Resource types in this package:

- [SecurityConfig](#securityconfig)



<a id="securityconfig"></a>
### SecurityConfig

| Field | Value |
| --- | --- |
| Package | `accesserator.kartverket.no/v1alpha` |
| API version | `accesserator.kartverket.no/v1alpha` |
| Kind | `SecurityConfig` |

SecurityConfig is the Schema for the securityconfigs API

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
      <td>accesserator.kartverket.no/v1alpha</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b>kind</b></td>
      <td>string</td>
      <td>SecurityConfig</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#objectmeta-v1-meta">metadata</a></b></td>
      <td>object</td>
      <td>Refer to the Kubernetes API documentation for the fields of the `metadata` field.</td>
      <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspec">spec</a></b></td>
        <td>object</td>
        <td>
          spec defines the desired state of SecurityConfig<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigstatus">status</a></b></td>
        <td>object</td>
        <td>
          status defines the observed state of SecurityConfig<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspec"></a>
#### SecurityConfig.spec

<sup>[Parent](#securityconfig)</sup>

spec defines the desired state of SecurityConfig

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
        <td><b>applicationRef</b></td>
        <td>string</td>
        <td>
          ApplicationRef is a reference to the name of the SKIP application for which this SecurityConfig applies.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecansattporten">ansattporten</a></b></td>
        <td>object</td>
        <td>
          Ansattporten specifies whether to configure Ansattporten token validation for an application referred to by `applicationRef`.<br/>When enabled, an Istio ServiceEntry is created to allow egress to Ansattporten, and the Texas sidecar is configured<br/>to validate Ansattporten tokens against the audiences specified in `allowedAudience`.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraid">entraid</a></b></td>
        <td>object</td>
        <td>
          EntraID specifies whether to configure the Entra ID API consumer capability for an application referred to by `applicationRef`.<br/>The configuration can either be provided inline via the `client` field,<br/>by referencing an existing AzureAdApplication resource via the `clientRef` field,<br/>or by sourcing credentials from existing Kubernetes secrets via the `secretRef` field.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecidporten">idporten</a></b></td>
        <td>object</td>
        <td>
          Idporten specifies whether to configure ID-porten token validation for an application referred to by `applicationRef`.<br/>When enabled, an Istio ServiceEntry is created to allow egress to ID-porten, and the Texas sidecar is configured<br/>to validate ID-porten tokens against the audience specified in `allowedAudience`.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinporten">maskinporten</a></b></td>
        <td>object</td>
        <td>
          Maskinporten specifies whether to configure the maskinporten API consumer capability for an application referred to by `applicationRef`.<br/>The configuration can either be provided inline via the `client` field,<br/>by referencing an existing MaskinportenClient resource via the `clientRef` field,<br/>or by sourcing credentials from existing Kubernetes secrets via the `secretRef` field.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecopa">opa</a></b></td>
        <td>object</td>
        <td>
          Opa specifies whether to configure the open policy agent capability for an application referred to by `applicationRef`.<br/>The configuration includes which bundles compiled from rego policies, and how often OPA should check for updates to these bundles.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspectokenx">tokenx</a></b></td>
        <td>object</td>
        <td>
          Tokenx specifies whether to configure the token exchange capability for an application referred to by `applicationRef`.<br/>accessPolicies of the application referred to by applicationRef<br/>will be used to restrict which applications can exchange tokens where the specified application is the intended audience.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecansattporten"></a>
#### SecurityConfig.spec.ansattporten

<sup>[Parent](#securityconfigspec)</sup>

Ansattporten specifies whether to configure Ansattporten token validation for an application referred to by `applicationRef`.
When enabled, an Istio ServiceEntry is created to allow egress to Ansattporten, and the Texas sidecar is configured
to validate Ansattporten tokens against the audiences specified in `allowedAudience`.

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
        <td><b><a href="#securityconfigspecansattportenallowedaudience">allowedAudience</a></b></td>
        <td>object</td>
        <td>
          AllowedAudience defines the audience (`aud`) value that Ansattporten tokens are validated against by the Texas<br/>sidecar. Either a static value or sourced from a ConfigMap or Secret.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>enabled</b></td>
        <td>boolean</td>
        <td>
          Enabled indicates whether Ansattporten token validation should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecansattportenallowedaudience"></a>
#### SecurityConfig.spec.ansattporten.allowedAudience

<sup>[Parent](#securityconfigspecansattporten)</sup>

AllowedAudience defines the audience (`aud`) value that Ansattporten tokens are validated against by the Texas
sidecar. Either a static value or sourced from a ConfigMap or Secret.

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
        <td><b><a href="#securityconfigspecansattportenallowedaudiencevaluefrom">valueFrom</a></b></td>
        <td>object</td>
        <td>
          ValueFrom specifies a reference to a kubernetes resource to retrieve the audience value from.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecansattportenallowedaudiencevaluefrom"></a>
#### SecurityConfig.spec.ansattporten.allowedAudience.valueFrom

<sup>[Parent](#securityconfigspecansattportenallowedaudience)</sup>

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
        <td><b><a href="#securityconfigspecansattportenallowedaudiencevaluefromconfigmapkeyref">configMapKeyRef</a></b></td>
        <td>object</td>
        <td>
          ConfigMapKeyRef specifies a reference to a key in a ConfigMap.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecansattportenallowedaudiencevaluefromsecretkeyref">secretKeyRef</a></b></td>
        <td>object</td>
        <td>
          SecretKeyRef specifies a reference to a key in a Secret.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecansattportenallowedaudiencevaluefromconfigmapkeyref"></a>
#### SecurityConfig.spec.ansattporten.allowedAudience.valueFrom.configMapKeyRef

<sup>[Parent](#securityconfigspecansattportenallowedaudiencevaluefrom)</sup>

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
<a id="securityconfigspecansattportenallowedaudiencevaluefromsecretkeyref"></a>
#### SecurityConfig.spec.ansattporten.allowedAudience.valueFrom.secretKeyRef

<sup>[Parent](#securityconfigspecansattportenallowedaudiencevaluefrom)</sup>

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
<a id="securityconfigspecentraid"></a>
#### SecurityConfig.spec.entraid

<sup>[Parent](#securityconfigspec)</sup>

EntraID specifies whether to configure the Entra ID API consumer capability for an application referred to by `applicationRef`.
The configuration can either be provided inline via the `client` field,
by referencing an existing AzureAdApplication resource via the `clientRef` field,
or by sourcing credentials from existing Kubernetes secrets via the `secretRef` field.

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
          Enabled indicates whether Entra ID should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidclient">client</a></b></td>
        <td>object</td>
        <td>
          Client defines the Entra ID client configuration inline.<br/>Use this when you want to configure the client directly.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidclientref">clientRef</a></b></td>
        <td>object</td>
        <td>
          ClientRef references an existing AzureAdApplication by name.<br/>Use this when a AzureAdApplication exists, and you want to reference it.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidsecretref">secretRef</a></b></td>
        <td>object</td>
        <td>
          SecretRef sources the client registration credentials from one or more existing Kubernetes secrets.<br/>Use this when you have an existing OAuth client registered outside the SecurityConfig CRD<br/>and AzureAdApplication CRD (e.g. manually registered at Entra).<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclient"></a>
#### SecurityConfig.spec.entraid.client

<sup>[Parent](#securityconfigspecentraid)</sup>

Client defines the Entra ID client configuration inline.
Use this when you want to configure the client directly.

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
        <td><b><a href="#securityconfigspecentraidclientgroupsindex">groups</a></b></td>
        <td>[]object</td>
        <td>
          Groups is a list of Entra ID group IDs to be emitted in the `groups` claim in tokens issued by Entra ID. This<br/>also assigns groups to the application for access control. Only direct members of the groups are granted access.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>logoutUrl</b></td>
        <td>string</td>
        <td>
          LogoutUrl is the URL where Entra ID sends a request to have the application clear the user&#39;s session data. This<br/>is required if single sign-out should work correctly. Must start with &#39;https&#39;<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidclientpreauthorizedapplicationsindex">preAuthorizedApplications</a></b></td>
        <td>[]object</td>
        <td>
          PreAuthorizedApplications is a list of Entra ID Applications that are authorized to perform client credential<br/>flow with this application as scope, or the on-behalf-of (OBO) flow.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidclientreplyurlsindex">replyUrls</a></b></td>
        <td>[]object</td>
        <td>
          ReplyUrls is a list of authorized redirect URIs Entra ID may use when performing authorization code flow. All<br/>production URLs must use the &#39;https&#39; scheme.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>secretName</b></td>
        <td>string</td>
        <td>
          SecretName is the name of the resulting Secret resource to be created. If not set, the secret will be given a<br/>a name based on the name of the SecurityConfig resource.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>singlePageApplication</b></td>
        <td>boolean</td>
        <td>
          SinglePageApplication denotes whether this Entra ID application should be registered as a single-page-application<br/>for usage in client-side applications without access to secrets.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclientgroupsindex"></a>
#### SecurityConfig.spec.entraid.client.groups[index]

<sup>[Parent](#securityconfigspecentraidclient)</sup>



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
        <td><b>id</b></td>
        <td>string</td>
        <td>
          ID is the actual `object ID` associated with the given group in Azure AD.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclientpreauthorizedapplicationsindex"></a>
#### SecurityConfig.spec.entraid.client.preAuthorizedApplications[index]

<sup>[Parent](#securityconfigspecentraidclient)</sup>



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
        <td><b>application</b></td>
        <td>string</td>
        <td>
          The application&#39;s name.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>cluster</b></td>
        <td>string</td>
        <td>
          The application&#39;s cluster. May be omitted if it should be in the same cluster as your application.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>namespace</b></td>
        <td>string</td>
        <td>
          The application&#39;s namespace. May be omitted if it should be in the same namespace as your application.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidclientpreauthorizedapplicationsindexpermissions">permissions</a></b></td>
        <td>object</td>
        <td>
          Permissions contains a set of permissions that are granted to the given application.<br/>Currently only applicable for Azure AD clients.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclientpreauthorizedapplicationsindexpermissions"></a>
#### SecurityConfig.spec.entraid.client.preAuthorizedApplications[index].permissions

<sup>[Parent](#securityconfigspecentraidclientpreauthorizedapplicationsindex)</sup>

Permissions contains a set of permissions that are granted to the given application.
Currently only applicable for Azure AD clients.

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
        <td><b>roles</b></td>
        <td>[]string</td>
        <td>
          Roles is a set of custom permission roles that are granted to a given application.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>scopes</b></td>
        <td>[]string</td>
        <td>
          Scopes is a set of custom permission scopes that are granted to a given application.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclientreplyurlsindex"></a>
#### SecurityConfig.spec.entraid.client.replyUrls[index]

<sup>[Parent](#securityconfigspecentraidclient)</sup>

AzureAdReplyUrl defines the valid reply URLs for callbacks after OIDC flows for this application

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
        <td><b>url</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidclientref"></a>
#### SecurityConfig.spec.entraid.clientRef

<sup>[Parent](#securityconfigspecentraid)</sup>

ClientRef references an existing AzureAdApplication by name.
Use this when a AzureAdApplication exists, and you want to reference it.

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
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name of the referenced resource.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidsecretref"></a>
#### SecurityConfig.spec.entraid.secretRef

<sup>[Parent](#securityconfigspecentraid)</sup>

SecretRef sources the client registration credentials from one or more existing Kubernetes secrets.
Use this when you have an existing OAuth client registered outside the SecurityConfig CRD
and AzureAdApplication CRD (e.g. manually registered at Entra).

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
        <td><b><a href="#securityconfigspecentraidsecretrefclientid">clientID</a></b></td>
        <td>object</td>
        <td>
          ClientID references the secret key containing the Maskinporten client ID (MASKINPORTEN_CLIENT_ID).<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecentraidsecretrefclientjwk">clientJWK</a></b></td>
        <td>object</td>
        <td>
          ClientJWK references the secret key containing the Maskinporten client JWK (MASKINPORTEN_CLIENT_JWK).<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidsecretrefclientid"></a>
#### SecurityConfig.spec.entraid.secretRef.clientID

<sup>[Parent](#securityconfigspecentraidsecretref)</sup>

ClientID references the secret key containing the Maskinporten client ID (MASKINPORTEN_CLIENT_ID).

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
          Key is the key within the secret whose value should be used.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the Kubernetes secret.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecentraidsecretrefclientjwk"></a>
#### SecurityConfig.spec.entraid.secretRef.clientJWK

<sup>[Parent](#securityconfigspecentraidsecretref)</sup>

ClientJWK references the secret key containing the Maskinporten client JWK (MASKINPORTEN_CLIENT_JWK).

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
          Key is the key within the secret whose value should be used.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the Kubernetes secret.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecidporten"></a>
#### SecurityConfig.spec.idporten

<sup>[Parent](#securityconfigspec)</sup>

Idporten specifies whether to configure ID-porten token validation for an application referred to by `applicationRef`.
When enabled, an Istio ServiceEntry is created to allow egress to ID-porten, and the Texas sidecar is configured
to validate ID-porten tokens against the audience specified in `allowedAudience`.

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
        <td><b><a href="#securityconfigspecidportenallowedaudience">allowedAudience</a></b></td>
        <td>object</td>
        <td>
          AllowedAudience defines the audience (`aud`) value that ID-porten tokens are validated against by the Texas<br/>sidecar. Either a static value or sourced from a ConfigMap or Secret.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>enabled</b></td>
        <td>boolean</td>
        <td>
          Enabled indicates whether ID-porten token validation should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecidportenallowedaudience"></a>
#### SecurityConfig.spec.idporten.allowedAudience

<sup>[Parent](#securityconfigspecidporten)</sup>

AllowedAudience defines the audience (`aud`) value that ID-porten tokens are validated against by the Texas
sidecar. Either a static value or sourced from a ConfigMap or Secret.

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
        <td><b><a href="#securityconfigspecidportenallowedaudiencevaluefrom">valueFrom</a></b></td>
        <td>object</td>
        <td>
          ValueFrom specifies a reference to a kubernetes resource to retrieve the audience value from.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecidportenallowedaudiencevaluefrom"></a>
#### SecurityConfig.spec.idporten.allowedAudience.valueFrom

<sup>[Parent](#securityconfigspecidportenallowedaudience)</sup>

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
        <td><b><a href="#securityconfigspecidportenallowedaudiencevaluefromconfigmapkeyref">configMapKeyRef</a></b></td>
        <td>object</td>
        <td>
          ConfigMapKeyRef specifies a reference to a key in a ConfigMap.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecidportenallowedaudiencevaluefromsecretkeyref">secretKeyRef</a></b></td>
        <td>object</td>
        <td>
          SecretKeyRef specifies a reference to a key in a Secret.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecidportenallowedaudiencevaluefromconfigmapkeyref"></a>
#### SecurityConfig.spec.idporten.allowedAudience.valueFrom.configMapKeyRef

<sup>[Parent](#securityconfigspecidportenallowedaudiencevaluefrom)</sup>

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
<a id="securityconfigspecidportenallowedaudiencevaluefromsecretkeyref"></a>
#### SecurityConfig.spec.idporten.allowedAudience.valueFrom.secretKeyRef

<sup>[Parent](#securityconfigspecidportenallowedaudiencevaluefrom)</sup>

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
<a id="securityconfigspecmaskinporten"></a>
#### SecurityConfig.spec.maskinporten

<sup>[Parent](#securityconfigspec)</sup>

Maskinporten specifies whether to configure the maskinporten API consumer capability for an application referred to by `applicationRef`.
The configuration can either be provided inline via the `client` field,
by referencing an existing MaskinportenClient resource via the `clientRef` field,
or by sourcing credentials from existing Kubernetes secrets via the `secretRef` field.

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
          Enabled indicates whether Maskinporten should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinportenclient">client</a></b></td>
        <td>object</td>
        <td>
          Client defines the Maskinporten client configuration inline.<br/>Use this when you want to configure the client directly.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinportenclientref">clientRef</a></b></td>
        <td>object</td>
        <td>
          ClientRef references an existing MaskinportenClient by name.<br/>Use this when a client registration resource exists, and you want to reference it.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinportensecretref">secretRef</a></b></td>
        <td>object</td>
        <td>
          SecretRef sources the client registration client credentials from one or more existing Kubernetes secrets.<br/>Use this when you have an existing OAuth client registered outside the SecurityConfig CRD<br/>and MaskinportenClient CRD (e.g. manually registered at DigDir).<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportenclient"></a>
#### SecurityConfig.spec.maskinporten.client

<sup>[Parent](#securityconfigspecmaskinporten)</sup>

Client defines the Maskinporten client configuration inline.
Use this when you want to configure the client directly.

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
        <td><b>clientName</b></td>
        <td>string</td>
        <td>
          ClientName is the client name to be registered at DigDir.<br/>It is shown during login for user-centric flows, and is otherwise a human-readable way to differentiate between clients at DigDir&#39;s self-service portal.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinportenclientscopes">scopes</a></b></td>
        <td>object</td>
        <td>
          Scopes is an object of consumed scopes.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportenclientscopes"></a>
#### SecurityConfig.spec.maskinporten.client.scopes

<sup>[Parent](#securityconfigspecmaskinportenclient)</sup>

Scopes is an object of consumed scopes.

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
        <td><b><a href="#securityconfigspecmaskinportenclientscopesconsumesindex">consumes</a></b></td>
        <td>[]object</td>
        <td>
          `consumes` is a list of scopes that your client can request access to.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportenclientscopesconsumesindex"></a>
#### SecurityConfig.spec.maskinporten.client.scopes.consumes[index]

<sup>[Parent](#securityconfigspecmaskinportenclientscopes)</sup>



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
        <td><b>name</b></td>
        <td>string</td>
        <td>
          The scope consumed by the application to gain access to an external organization API.<br/>Ensure that the NAV organization has been granted access to the scope prior to requesting access.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportenclientref"></a>
#### SecurityConfig.spec.maskinporten.clientRef

<sup>[Parent](#securityconfigspecmaskinporten)</sup>

ClientRef references an existing MaskinportenClient by name.
Use this when a client registration resource exists, and you want to reference it.

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
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name of the referenced resource.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportensecretref"></a>
#### SecurityConfig.spec.maskinporten.secretRef

<sup>[Parent](#securityconfigspecmaskinporten)</sup>

SecretRef sources the client registration client credentials from one or more existing Kubernetes secrets.
Use this when you have an existing OAuth client registered outside the SecurityConfig CRD
and MaskinportenClient CRD (e.g. manually registered at DigDir).

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
        <td><b><a href="#securityconfigspecmaskinportensecretrefclientid">clientID</a></b></td>
        <td>object</td>
        <td>
          ClientID references the secret key containing the Maskinporten client ID (MASKINPORTEN_CLIENT_ID).<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecmaskinportensecretrefclientjwk">clientJWK</a></b></td>
        <td>object</td>
        <td>
          ClientJWK references the secret key containing the Maskinporten client JWK (MASKINPORTEN_CLIENT_JWK).<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportensecretrefclientid"></a>
#### SecurityConfig.spec.maskinporten.secretRef.clientID

<sup>[Parent](#securityconfigspecmaskinportensecretref)</sup>

ClientID references the secret key containing the Maskinporten client ID (MASKINPORTEN_CLIENT_ID).

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
          Key is the key within the secret whose value should be used.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the Kubernetes secret.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecmaskinportensecretrefclientjwk"></a>
#### SecurityConfig.spec.maskinporten.secretRef.clientJWK

<sup>[Parent](#securityconfigspecmaskinportensecretref)</sup>

ClientJWK references the secret key containing the Maskinporten client JWK (MASKINPORTEN_CLIENT_JWK).

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
          Key is the key within the secret whose value should be used.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the Kubernetes secret.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecopa"></a>
#### SecurityConfig.spec.opa

<sup>[Parent](#securityconfigspec)</sup>

Opa specifies whether to configure the open policy agent capability for an application referred to by `applicationRef`.
The configuration includes which bundles compiled from rego policies, and how often OPA should check for updates to these bundles.

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
        <td><b><a href="#securityconfigspecopabundleurlsindex">bundleUrls</a></b></td>
        <td>[]object</td>
        <td>
          BundleURLs is a list of URLs pointing to OPA bundles containing compiled rego policies.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>enabled</b></td>
        <td>boolean</td>
        <td>
          Enabled indicates whether OPA should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecoparequestpolicy">requestPolicy</a></b></td>
        <td>object</td>
        <td>
          RequestPolicy enables per-request evaluation against the OPA sidecar via Envoy&#39;s external authorization<br/>(ext_authz) filter. When configured, every incoming request to the application is sent to OPA for<br/>policy evaluation before it reaches the application container. The rego policy decides the outcome,<br/>which may be authorization (allow/deny) or request enrichment (e.g. adding headers).<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecopabundleurlsindex"></a>
#### SecurityConfig.spec.opa.bundleUrls[index]

<sup>[Parent](#securityconfigspecopa)</sup>

BundleSource defines a source for an OPA bundle.

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
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name specifies a human-readable name for the OPA bundle.<br/>It is used to differentiate between bundles which is used by OPA.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>url</b></td>
        <td>string</td>
        <td>
          URL is the OCI registry location of the OPA bundle.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecopabundleurlsindexverification">verification</a></b></td>
        <td>object</td>
        <td>
          Verification specifies how to verify the integrity of the bundle.<br/>If not specified, the bundle will not be verified.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecopabundleurlsindexverification"></a>
#### SecurityConfig.spec.opa.bundleUrls[index].verification

<sup>[Parent](#securityconfigspecopabundleurlsindex)</sup>

Verification specifies how to verify the integrity of the bundle.
If not specified, the bundle will not be verified.

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
        <td><b><a href="#securityconfigspecopabundleurlsindexverificationsource">source</a></b></td>
        <td>object</td>
        <td>
          Source is the GitHub repository where the bundle was created.<br/>
        </td>
        <td>true</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecopabundleurlsindexverificationsource"></a>
#### SecurityConfig.spec.opa.bundleUrls[index].verification.source

<sup>[Parent](#securityconfigspecopabundleurlsindexverification)</sup>

Source is the GitHub repository where the bundle was created.

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
        <td><b>repository</b></td>
        <td>string</td>
        <td>
          Repository is the GitHub repository where the bundle was created,<br/>in the form &#34;&lt;org-or-user&gt;/&lt;repo&gt;&#34; (e.g. &#34;kartverket/accesserator&#34;).<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>ref</b></td>
        <td>string</td>
        <td>
          Ref is the Git reference (branch, tag, or commit) of the bundle.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>workflow</b></td>
        <td>string</td>
        <td>
          Workflow is the name of the GitHub workflow that created the bundle.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecoparequestpolicy"></a>
#### SecurityConfig.spec.opa.requestPolicy

<sup>[Parent](#securityconfigspecopa)</sup>

RequestPolicy enables per-request evaluation against the OPA sidecar via Envoy's external authorization
(ext_authz) filter. When configured, every incoming request to the application is sent to OPA for
policy evaluation before it reaches the application container. The rego policy decides the outcome,
which may be authorization (allow/deny) or request enrichment (e.g. adding headers).

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
          Enabled indicates whether Envoy should call the OPA sidecar for external authorization on each<br/>request. When false, no EnvoyFilter is installed and requests bypass OPA evaluation entirely.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>endpoint</b></td>
        <td>string</td>
        <td>
          Endpoint is the OPA Data API endpoint that Envoy queries for each request. It must start with<br/>`/v1/data` and be followed by the slash-separated package/rule path of the rego rule to evaluate<br/>(e.g. `/v1/data/envoy/authz/allow`). The referenced rule must be defined in one of the loaded<br/>bundles.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>failureMode</b></td>
        <td>enum</td>
        <td>
          FailureMode determines how Envoy handles requests when the OPA sidecar is unreachable or returns<br/>an error (e.g. HTTP 5xx). `DENY` fails closed and rejects the request, which is the<br/>safe choice when OPA is used for authorization. `FORWARD` fails open and lets the request through<br/>to the application; only use this when OPA is used purely for enrichment or non-critical checks,<br/>never for authorization decisions.<br/>Defaults to DENY.<br/>
          <br/>
            <i>Enum</i>: FORWARD, DENY<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspecoparequestpolicyrequestbody">requestBody</a></b></td>
        <td>object</td>
        <td>
          RequestBody specifies whether to include the request body in the ext_authz gRPC request to OPA. This is<br/>required if the rego policy needs to evaluate the request body.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspecoparequestpolicyrequestbody"></a>
#### SecurityConfig.spec.opa.requestPolicy.requestBody

<sup>[Parent](#securityconfigspecoparequestpolicy)</sup>

RequestBody specifies whether to include the request body in the ext_authz gRPC request to OPA. This is
required if the rego policy needs to evaluate the request body.

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
        <td><b>include</b></td>
        <td>boolean</td>
        <td>
          Include indicates whether Envoy should include the request body in the call made by the ext_authz filter to the<br/>OPA sidecar.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>maxRequestBodyBytes</b></td>
        <td>integer</td>
        <td>
          MaxRequestBodyBytes sets the maximum size of a message body that Envoy will hold in memory. Envoy will return<br/>HTTP 413 and will not initiate the authorization process when the buffer reaches the size set in this field.<br/>This maximum limit will apply to all requests the application receives.<br/>
          <br/>
            <i>Minimum</i>: 1<br/>
            <i>Maximum</i>: 1.048576e+06<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspectokenx"></a>
#### SecurityConfig.spec.tokenx

<sup>[Parent](#securityconfigspec)</sup>

Tokenx specifies whether to configure the token exchange capability for an application referred to by `applicationRef`.
accessPolicies of the application referred to by applicationRef
will be used to restrict which applications can exchange tokens where the specified application is the intended audience.

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
          Enabled indicates whether token exchange should be configured for the application.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigspectokenxaccesspolicy">accessPolicy</a></b></td>
        <td>object</td>
        <td>
          AccessPolicy specifies configuration of which clients can exchange tokens with the application as target when<br/>token exchange is enabled. If not specified, no clients are allowed.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspectokenxaccesspolicy"></a>
#### SecurityConfig.spec.tokenx.accessPolicy

<sup>[Parent](#securityconfigspectokenx)</sup>

AccessPolicy specifies configuration of which clients can exchange tokens with the application as target when
token exchange is enabled. If not specified, no clients are allowed.

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
        <td><b><a href="#securityconfigspectokenxaccesspolicyclientsindex">clients</a></b></td>
        <td>[]object</td>
        <td>
          Clients which may perform token exchange with your application as target.<br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>inheritInboundRules</b></td>
        <td>boolean</td>
        <td>
          InheritInboundRules specifies whether the inbound access policy rules of the corresponding Skiperator Application<br/>should be used as clients for token exchange. Defaults to false. When set to true, the complete list of clients<br/>will be the union of the explicitly specified clients in Clients and the clients resolved from inbound rules.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigspectokenxaccesspolicyclientsindex"></a>
#### SecurityConfig.spec.tokenx.accessPolicy.clients[index]

<sup>[Parent](#securityconfigspectokenxaccesspolicy)</sup>

AccessPolicyClient define client applications which may perform token exchange with your application as target.

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
        <td><b>application</b></td>
        <td>string</td>
        <td>
          Application is the name of the client application that can exchange tokens with the target application.<br/>
        </td>
        <td>true</td>
      </tr>
      <tr>
        <td><b>namespace</b></td>
        <td>string</td>
        <td>
          Namespace is the namespace which the client application resides. If not specified, the namespace of the<br/>SecurityConfig&#39;s referenced application will be used.<br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>
<a id="securityconfigstatus"></a>
#### SecurityConfig.status

<sup>[Parent](#securityconfig)</sup>

status defines the observed state of SecurityConfig

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
        <td><b>ansattportenAudience</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b><a href="#securityconfigstatusconditionsindex">conditions</a></b></td>
        <td>[]object</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>entraIdSecretName</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>idportenAudience</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>jwkerSecretName</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>maskinportenSecretName</b></td>
        <td>string</td>
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
        <td><b><a href="#securityconfigstatusopabundlesource">opaBundleSource</a></b></td>
        <td>object</td>
        <td>
          OpaBundleSource defines the source of OPA bundles used for policy evaluation.<br/>
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
<a id="securityconfigstatusconditionsindex"></a>
#### SecurityConfig.status.conditions[index]

<sup>[Parent](#securityconfigstatus)</sup>

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
<a id="securityconfigstatusopabundlesource"></a>
#### SecurityConfig.status.opaBundleSource

<sup>[Parent](#securityconfigstatus)</sup>

OpaBundleSource defines the source of OPA bundles used for policy evaluation.

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
        <td><b>bundleNames</b></td>
        <td>[]string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
      <tr>
        <td><b>configMapName</b></td>
        <td>string</td>
        <td>
          <br/>
        </td>
        <td>false</td>
      </tr>
    </tbody>
</table>