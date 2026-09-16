// Copied from @ngx-formly/core and adjusted (only json properties are accepted in formly-designer)
//import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FormlyFieldConfig {
  /**
   * The key that relates to the model. This will link the field value to the model
   */
  key?: string | number | (string | number)[];
  /**
   * This should be a formly-field type added either by you or a plugin. More information over at Creating Formly Fields.
   */
  type?: string;
  /**
   * Use `defaultValue` to initialize it the model. If this is provided and the value of the model at compile-time is undefined, then the value of the model will be assigned to `defaultValue`.
   */
  defaultValue?: any;
  /**
   * This allows you to specify the `id` of your field. Note, the `id` is generated if not set.
   */
  id?: string;
  /**
   * If you wish, you can specify a specific `name` for your field. This is useful if you're posting the form to a server using techniques of yester-year.
   */
  name?: string;
  /**
   * This is reserved for the templates. Any template-specific options go in here. Look at your specific template implementation to know the options required for this.
   */
  props?: FormlyFieldProps;
  /**
   * An object with a few useful properties
   * - `validation.messages`: A map of message names that will be displayed when the field has errors.
   * - `validation.show`: A boolean you as the developer can set to force displaying errors whatever the state of field. This is useful when you're trying to call the user's attention to some fields for some reason.
   */
  validation?: {
    messages?: {
      [messageProperties: string]: ValidationMessageOption['message'];
    };
    show?: boolean;
    [additionalProperties: string]: any;
  };
  /**
   * Used to set validation rules for a particular field.
   * Should be an object of key - value pairs. The value can either be an expression to evaluate or a function to run.
   * Each should return a boolean value, returning true when the field is valid. See Validation for more information.
   */
  validators?: FormlyValidation;
  /**
   * Use this one for anything that needs to validate asynchronously.
   * Pretty much exactly the same as the validators api, except it must be a function that returns a promise.
   */
  asyncValidators?: FormlyValidation;
  /**
   * Can be set instead of `type` to render custom html content.
   */
  template?: string;
  /**
   *  It is expected to be the name of the wrappers.
   *  The formly field template will be wrapped by the first wrapper, then the second, then the third, etc.
   *  You can also specify these as part of a type (which is the recommended approach).
   */
  wrappers?: string[];
  /**
   * Whether to hide the field. Defaults to false. If you wish this to be conditional use `expressions: { hide: ... }`
   */
  hide?: boolean;
  /**
   * Whether to reset the value on hide or not. Defaults to `true`.
   */
  resetOnHide?: boolean;
  /**
   * An object where the key is a property to be set on the main field config and the value is an expression used to assign that property.
   */
  expressions?: { [property: string]: string };
  /**
   * You can specify your own class that will be applied to the `formly-field` component.
   */
  className?: string;
  /**
   * Specify your own class that will be applied to the `formly-group` component.
   */
  fieldGroupClassName?: string;
  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).
   */
  fieldGroup?: FormlyFieldConfig[];
  fieldArray?: FormlyFieldConfig;
  /**
   * Whether to focus or blur the element field. Defaults to false. If you wish this to be conditional use `expressions`
   */
  focus?: boolean;
  /**
   * An object with a few useful properties to control the model changes
   * - `debounce`: integer value which contains the debounce model update value in milliseconds. A value of 0 triggers an immediate update.
   * - `updateOn`: string event value that instructs when the control should be updated
   */
  modelOptions?: {
    debounce?: {
      default: number;
    };
    updateOn?: 'change' | 'blur' | 'submit';
  };
}
export interface FormlyFieldProps {
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: any[];
  rows?: number;
  cols?: number;
  description?: string;
  hidden?: boolean;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
  tabindex?: number;
  readonly?: boolean;
  attributes?: {
    [key: string]: string | number;
  };
  step?: number;
  [key: string]: any;
}
interface ValidationMessageOption {
  name: string;
  message: string | ((error: any, field: FormlyFieldConfig) => string);
}
interface FormlyValidation {
  validation?: any;
  [key: string]: any;
}
