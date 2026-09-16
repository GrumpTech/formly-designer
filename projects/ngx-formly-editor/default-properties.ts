export const defaultProperties = {
  key: {
    key: 'key',
    type: 'formly-editor-input',
    props: { label: 'key' },
  },
  id: {
    key: 'id',
    type: 'formly-editor-input',
    props: { label: 'id' },
  },
  name: {
    key: 'name',
    type: 'formly-editor-input',
    props: { label: 'name' },
  },
  type: {
    key: 'type',
    type: 'formly-editor-select',
    props: { label: 'type' },
  },
  className: {
    key: 'className',
    type: 'formly-editor-input',
    props: { label: 'className' },
  },
  template: {
    key: 'template',
    type: 'formly-editor-textarea',
    props: { label: 'template' },
  },
  defaultValue: {
    key: 'defaultValue',
    type: 'formly-editor-input',
    props: { label: 'defaultValue' },
  },
  hide: {
    key: 'hide',
    type: 'formly-editor-checkbox',
    props: { label: 'hide' },
  },
  focus: {
    key: 'focus',
    type: 'formly-editor-checkbox',
    props: { label: 'focus' },
  },
  fieldGroupClassName: {
    key: 'fieldGroupClassName',
    type: 'formly-editor-input',
    props: { label: 'fieldGroupClassName' },
  },
  'props.type': {
    key: 'props.type',
    type: 'formly-editor-input',
    props: { label: 'type' },
  },
  'props.label': {
    key: 'props.label',
    type: 'formly-editor-input',
    props: { label: 'label' },
  },
  'props.placeholder': {
    key: 'props.placeholder',
    type: 'formly-editor-input',
    props: { label: 'placeholder' },
  },
  'props.disabled': {
    key: 'props.disabled',
    type: 'formly-editor-checkbox',
    props: { label: 'disabled' },
  },
  'props.options': {
    key: 'props.options',
    type: 'formly-editor-array-dialog',
    props: {
      label: 'options',
      dialogTitle: 'Options',
      field: {
        fieldGroup: [
          {
            key: 'label',
            type: 'formly-editor-input',
            props: { label: 'Label' },
          },
          {
            key: 'value',
            type: 'formly-editor-input',
            props: { label: 'Value' },
          },
        ],
      },
    },
  },
  'props.rows': {
    key: 'props.rows',
    type: 'formly-editor-input-number',
    props: { label: 'rows' },
  },
  'props.cols': {
    key: 'props.cols',
    type: 'formly-editor-input-number',
    props: { label: 'cols' },
  },
  'props.description': {
    key: 'props.description',
    type: 'formly-editor-input',
    props: { label: 'description' },
  },
  'props.hidden': {
    key: 'props.hidden',
    type: 'formly-editor-checkbox',
    props: { label: 'hidden' },
  },
  'props.max': {
    key: 'props.max',
    type: 'formly-editor-input-number',
    props: { label: 'max' },
  },
  'props.min': {
    key: 'props.min',
    type: 'formly-editor-input-number',
    props: { label: 'min' },
  },
  'props.minLength': {
    key: 'props.minLength',
    type: 'formly-editor-input-number',
    props: { label: 'minLength' },
  },
  'props.maxLength': {
    key: 'props.maxLength',
    type: 'formly-editor-input-number',
    props: { label: 'maxLength' },
  },
  'props.pattern': {
    key: 'props.pattern',
    type: 'formly-editor-input',
    props: { label: 'pattern' },
  },
  'props.required': {
    key: 'props.required',
    type: 'formly-editor-checkbox',
    props: { label: 'required' },
  },
  'props.tabindex': {
    key: 'props.tabindex',
    type: 'formly-editor-input-number',
    props: { label: 'tabindex' },
  },
  'props.readonly': {
    key: 'props.readonly',
    type: 'formly-editor-checkbox',
    props: { label: 'readonly' },
  },
  'props.step': {
    key: 'props.step',
    type: 'formly-editor-input-number',
    props: { label: 'step' },
  },
  spacing: {},
  'props.url': {
    key: 'props.url',
    type: 'formly-editor-input',
    props: { label: 'url' },
  },
  'props.method': {
    key: 'props.method',
    type: 'formly-editor-input',
    props: { label: 'method' },
  },
  'props.valueKey': {
    key: 'props.valueKey',
    type: 'formly-editor-input',
    props: { label: 'value key' },
  },
  'props.labelKey': {
    key: 'props.labelKey',
    type: 'formly-editor-input',
    props: { label: 'label key' },
  },
  'props.inputGroups': {
    key: 'props.inputGroups',
    type: 'formly-editor-select',
    props: {
      label: 'input groups',
      multiple: true,
      options: [
        { label: 'path', value: 'path' },
        { label: 'query', value: 'query' },
        { label: 'body', value: 'body' },
        { label: 'result', value: 'result' },
      ],
    },
  },
  'props.responseType': {
    key: 'props.responseType',
    type: 'formly-editor-select',
    props: {
      label: 'response type',
      options: [
        { label: 'none', value: undefined },
        { label: 'arraybuffer', value: 'arraybuffer' },
        { label: 'blob', value: 'blob' },
        { label: 'json', value: 'json' },
        { label: 'text', value: 'text' },
      ],
    },
  },
  'props.addButtonLabel': {
    key: 'props.addButtonLabel',
    type: 'formly-editor-input',
    props: { label: 'add button label' },
  },
  'props.emptyArrayMessage': {
    key: 'props.emptyArrayMessage',
    type: 'formly-editor-input',
    props: { label: 'empty array message' },
  },
  'props.navigationDisabled': {
    key: 'props.navigationDisabled',
    type: 'formly-editor-checkbox',
    props: { label: 'disable navigation' },
  },
  'props.action': {
    key: 'props.action',
    type: 'formly-editor-select',
    props: {
      label: 'action',
      options: [
        { label: 'send-and-clear', value: 'send-and-clear' },
        { label: 'send-and-close', value: 'send-and-close' },
        { label: 'send-and-navigate', value: 'send-and-navigate' },
        { label: 'send-and-show-message', value: 'send-and-show-message' },
      ],
    },
  },
  'props.autoRun': {
    key: 'props.autoRun',
    type: 'formly-editor-checkbox',
    props: { label: 'run automatically' },
  },
  'props.form': {
    key: 'props.form',
    type: 'formly-editor-input',
    props: { label: 'form' },
  },
  'props.menu': {
    key: 'props.menu',
    type: 'formly-editor-menu-dialog',
    props: { label: 'menu' },
  },
  'props.pages': {
    key: 'props.pages',
    type: 'formly-editor-array-dialog',
    props: {
      label: 'pages',
      dialogTitle: 'Pages',
      width: 800,
      field: {
        fieldGroup: [
          {
            key: 'url',
            type: 'formly-editor-input',
            props: { label: 'url' },
          },
          {
            key: 'breadcrumbParts',
            type: 'formly-editor-array-dialog',
            props: {
              label: 'breadcrumb parts',
              dialogTitle: 'Breadcrumb parts',
              width: 750,
              field: {
                fieldGroup: [
                  {
                    key: 'label',
                    type: 'formly-editor-input',
                    props: { label: 'label' },
                  },
                  {
                    key: 'url',
                    type: 'formly-editor-input',
                    props: { label: 'url' },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};
