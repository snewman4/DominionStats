
export function getLabel(fullName) {
    return labels.find(label => label.fullName == fullName)?.value;
}

const labels = [
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityBadInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityBadInput",
      "value": "Enter a valid value."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityPatternMismatch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityPatternMismatch",
      "value": "Your entry does not match the allowed pattern."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityTypeMismatch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityTypeMismatch",
      "value": "You have entered an invalid format."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityValueMissing",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityValueMissing",
      "value": "Complete this field."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityRangeOverflow",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityRangeOverflow",
      "value": "The number is too high."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityRangeUnderflow",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityRangeUnderflow",
      "value": "The number is too low."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityStepMismatch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityStepMismatch",
      "value": "Your entry isn't a valid increment."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityTooLong",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityTooLong",
      "value": "Your entry is too long."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningErrorMessage_validityTooShort",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "validityTooShort",
      "value": "Your entry is too short."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCarousel_tabString",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "tabString",
      "value": "Tab"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCarousel_autoPlay",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "autoPlay",
      "value": "Stop auto-play"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputFile_buttonLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "buttonLabel",
      "value": "Upload Files"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputFile_bodyText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "bodyText",
      "value": "Or drop files"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputLocation_latitude",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "latitude",
      "value": "Latitude"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputLocation_longitude",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "longitude",
      "value": "Longitude"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputLocation_invalidLatitude",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidLatitude",
      "value": "Latitude should be a decimal number in a range [-90, 90]"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputLocation_invalidLongitude",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidLongitude",
      "value": "Longitude should be a decimal number in a range [-180, 180]"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputLocation_coordinateIsRequired",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "coordinateIsRequired",
      "value": "Coordinate is required"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningFormattedEmail_emailIconLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "emailIconLabel",
      "value": "Email"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextAssist_chooseFont",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "chooseFont",
      "value": "Choose a font"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextAssist_chooseSize",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "chooseSize",
      "value": "Choose a font size"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextAssist_composeText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "composeText",
      "value": "Compose text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_bold",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "bold",
      "value": "Bold"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_italic",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "italic",
      "value": "Italic"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_underline",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "underline",
      "value": "Underline"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_strike",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "strike",
      "value": "Strikethrough"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_bullet",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "bullet",
      "value": "Bulleted list"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_number",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "number",
      "value": "Numbered list"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_indent",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "indent",
      "value": "Indent"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_outdent",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "outdent",
      "value": "Outdent"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_leftAlign",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "leftAlign",
      "value": "Left align text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_centerAlign",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "centerAlign",
      "value": "Center align text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_rightAlign",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rightAlign",
      "value": "Right align text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_moreActions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "moreActions",
      "value": "More actions"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_link",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "link",
      "value": "Link"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_image",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "image",
      "value": "Image"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextButton_removeFormatting",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "removeFormatting",
      "value": "Remove formatting"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_formatText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "formatText",
      "value": "Format text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_formatBackground",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "formatBackground",
      "value": "Format background and text color"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_formatBody",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "formatBody",
      "value": "Format body"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_alignText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "alignText",
      "value": "Align text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_insertContent",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "insertContent",
      "value": "Insert content"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_removeFormatting",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "removeFormatting",
      "value": "Remove formatting"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_formatFont",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "formatFont",
      "value": "Format font family and size"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_font",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "font",
      "value": "Font"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_fontSize",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "fontSize",
      "value": "Font Size"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_linkInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "linkInput",
      "value": "Link URL"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_linkSave",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "linkSave",
      "value": "Save"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_linkCancel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "linkCancel",
      "value": "Cancel"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_imageSizeExceeded",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "imageSizeExceeded",
      "value": "The image exceeded the maximum size of 1 MB."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_imageUploadFailed",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "imageUploadFailed",
      "value": "There was a problem uploading the file."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRichTextEditor_imageUploadNotSupported",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "imageUploadNotSupported",
      "value": "Uploading images isn't supported for guest users."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_required",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "required",
      "value": "required"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_active",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "active",
      "value": "active"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_activeCapitalized",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "activeCapitalized",
      "value": "Active"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_inactive",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "inactive",
      "value": "inactive"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_inactiveCapitalized",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "inactiveCapitalized",
      "value": "Inactive"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_loading",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loading",
      "value": "Loading"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningControl_clear",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "clear",
      "value": "Clear"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputNumber_incrementCounter",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "incrementCounter",
      "value": "Increase number"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputNumber_decrementCounter",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "decrementCounter",
      "value": "Decrease number"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPill_warning",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "warning",
      "value": "Warning"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPill_remove",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "remove",
      "value": "Remove"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPill_error",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "error",
      "value": "Error"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPill_delete",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "delete",
      "value": "Press delete or backspace to remove"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPill_deleteAndNavigate",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "deleteAndNavigate",
      "value": "Press delete or backspace to remove, press enter to navigate"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPillContainer_label",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "label",
      "value": "Selected Options:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPillContainer_more",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "more",
      "value": "+{0} more"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningProgressBar_progress",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "progress",
      "value": "Progress"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningClickToDial_enabled",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "enabled",
      "value": "Click to dial"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningClickToDial_disabled",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "disabled",
      "value": "Click to dial disabled"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_componentAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "componentAssistiveText",
      "value": "Press Ctrl (Cmd on Mac) + Left Arrow or Ctrl (Cmd on Mac) + Right Arrow to move items between lists."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_moveSelectionToAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "moveSelectionToAssistiveText",
      "value": "Move selection to {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_upButtonAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "upButtonAssistiveText",
      "value": "Move selection up"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_downButtonAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "downButtonAssistiveText",
      "value": "Move selection down"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_optionLockAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "optionLockAssistiveText",
      "value": ": item cannot be removed from {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_maxHelp",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "maxHelp",
      "value": "[and a maximum of {0}]"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_minHelp",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "minHelp",
      "value": "[and a minimum of {0}]"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_maxError",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "maxError",
      "value": "Select at most {0} options"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_minErrorPlural",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "minErrorPlural",
      "value": "Select at least {0} options"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_minErrorSingular",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "minErrorSingular",
      "value": "Select at least 1 option"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_requiredError",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "requiredError",
      "value": "An option must be selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_minRequiredErrorPlural",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "minRequiredErrorPlural",
      "value": "At least {0} options must be selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_minRequiredErrorSingular",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "minRequiredErrorSingular",
      "value": "At least 1 option must be selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDualListbox_requiredOptionError",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "requiredOptionError",
      "value": "{0} must be selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningProgressIndicator_stageComplete",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "stageComplete",
      "value": "Stage Complete"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningProgressIndicator_currentStage",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "currentStage",
      "value": "Current Stage"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningListView_loadMore",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loadMore",
      "value": "Load More"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_selectAll",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectAll",
      "value": "Select All"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_selectItem",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectItem",
      "value": "Select Item"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_columnWidth",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "columnWidth",
      "value": "column width"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_sort",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "sort",
      "value": "Sort by:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_sortAsc",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "sortAsc",
      "value": "Sorted Ascending"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_sortDesc",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "sortDesc",
      "value": "Sorted Descending"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_sortNone",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "sortNone",
      "value": "Sorted: None"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_loading",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loading",
      "value": "Loading"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_showActions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "showActions",
      "value": "Show actions"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_wrapText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "wrapText",
      "value": "Wrap text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_clipText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "clipText",
      "value": "Clip text"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_edit",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "edit",
      "value": "Edit"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_editHasError",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "editHasError",
      "value": "has error"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_chooseARow",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "chooseARow",
      "value": "Choose a Row to Select"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_save",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "save",
      "value": "Save"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_apply",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "apply",
      "value": "Apply"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_cancel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "cancel",
      "value": "Cancel"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_error",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "error",
      "value": "Fix the errors and try saving again"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_closeButtonAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "closeButtonAssistiveText",
      "value": "Close dialog"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_rowLevelErrorAssistiveText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rowLevelErrorAssistiveText",
      "value": "{0} has {1} errors"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_updateSelectedItems",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "updateSelectedItems",
      "value": "Update {0} selected items"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_rowActionsDefaultAriaLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rowActionsDefaultAriaLabel",
      "value": "Actions"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_ariaLiveNavigationMode",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "ariaLiveNavigationMode",
      "value": "Navigation Mode"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_ariaLiveActionMode",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "ariaLiveActionMode",
      "value": "Action Mode"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDatatable_rowNumber",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rowNumber",
      "value": "Row Number"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningVerticalNavigation_newItems",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "newItems",
      "value": "New Items"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningVerticalNavigation_showLess",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "showLess",
      "value": "Show Less"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningVerticalNavigation_showMore",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "showMore",
      "value": "Show More"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningVerticalNavigation_subPage",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "subPage",
      "value": "Sub page"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningNoticeFooter_okButton",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "okButton",
      "value": "OK"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningSlider_slider",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "slider",
      "value": "Slider"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_placeholder",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "placeholder",
      "value": "Select an Option"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_pillCloseButtonAlternativeText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "pillCloseButtonAlternativeText",
      "value": "Clear Selection"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_selectedLabelSingle",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectedLabelSingle",
      "value": "1 Option Selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_selectedLabelMore",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectedLabelMore",
      "value": "{0} Options Selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_currentSelection",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "currentSelection",
      "value": "Current Selection:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_ariaSelectedOptions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "ariaSelectedOptions",
      "value": "Selected Options:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_loadingText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loadingText",
      "value": "Loading"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningCombobox_deselectOptionKeyboard",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "deselectOptionKeyboard",
      "value": "Press delete or backspace to remove"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPickerPanel_defaultTab",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "defaultTab",
      "value": "Default"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPickerPanel_customTab",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "customTab",
      "value": "Custom"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_colorPickerInstructions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "colorPickerInstructions",
      "value": "Use arrow keys to select a saturation and brightness, on an x and y axis."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_a11yTriggerText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "a11yTriggerText",
      "value": "Choose a color. Current color:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_hueInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "hueInput",
      "value": "Select Hue"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_hexLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "hexLabel",
      "value": "Hex"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_redAbbr",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "redAbbr",
      "value": "Red"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_rInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rInput",
      "value": "R"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_greenAbbr",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "greenAbbr",
      "value": "Green"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_gInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "gInput",
      "value": "G"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_blueAbbr",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "blueAbbr",
      "value": "Blue"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_bInput",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "bInput",
      "value": "B"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_doneButton",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "doneButton",
      "value": "Done"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_cancelButton",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "cancelButton",
      "value": "Cancel"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningColorPicker_errorMessage",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "errorMessage",
      "value": "Enter a valid hexadecimal value."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningHelptext_buttonAlternativeText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "buttonAlternativeText",
      "value": "Help"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTree_expandBranch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "expandBranch",
      "value": "Expand Tree Branch"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTree_collapseBranch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "collapseBranch",
      "value": "Collapse Tree Branch"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_previousMonth",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "previousMonth",
      "value": "Previous Month"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_nextMonth",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "nextMonth",
      "value": "Next Month"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_yearSelector",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "yearSelector",
      "value": "Pick a Year"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_today",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "today",
      "value": "Today"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_ariaLabelMonth",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "ariaLabelMonth",
      "value": "Date picker:"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_selectDate",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectDate",
      "value": "Select a date"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_dateLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "dateLabel",
      "value": "Date"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_timeLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "timeLabel",
      "value": "Time"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_invalidDate",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidDate",
      "value": "Your entry does not match the allowed format {0}."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_rangeOverflow",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rangeOverflow",
      "value": "Value must be {0} or earlier."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDateTimePicker_rangeUnderflow",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "rangeUnderflow",
      "value": "Value must be {0} or later."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPrimitiveCellActions_showActions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "showActions",
      "value": "Show actions"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPrimitiveCellActions_loadingActions",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loadingActions",
      "value": "Loading actions"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_salutation",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "salutation",
      "value": "Salutation"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_firstName",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "firstName",
      "value": "First Name"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_middleName",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "middleName",
      "value": "Middle Name"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_informalName",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "informalName",
      "value": "Informal Name"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_lastName",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "lastName",
      "value": "Last Name"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_suffix",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "suffix",
      "value": "Suffix"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningInputName_none",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "none",
      "value": "None"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPrimitiveCellTree_expandBranch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "expandBranch",
      "value": "Expand {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPrimitiveCellTree_collapseBranch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "collapseBranch",
      "value": "Collapse {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordEditForm_apiNameMismatch",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "apiNameMismatch",
      "value": "API Name {0} is invalid, did you mean \"{1}?\""
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordEditForm_genericError",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "genericError",
      "value": "Error in fetching record or record metadata."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordEditForm_invalidID",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidID",
      "value": "Error in fetching record: invalid record id."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordEditForm_invalidActionAsHandler",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidActionAsHandler",
      "value": "Value provided for attribute {0} is not a valid Aura.Action."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordForm_save",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "save",
      "value": "Save"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordForm_cancel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "cancel",
      "value": "Cancel"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningRecordForm_loading",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loading",
      "value": "Loading"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_add",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "add",
      "value": "Add"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_advancedSearchMobile",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "advancedSearchMobile",
      "value": "Show All Results for \"{0}\""
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_createNewObject",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "createNewObject",
      "value": "New {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_currentSelection",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "currentSelection",
      "value": "Current Selection"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_emptyStateNoResultText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "emptyStateNoResultText",
      "value": "No results for \"{0}\""
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_emptyStateNoResultMRUText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "emptyStateNoResultMRUText",
      "value": "No results yet..."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_emptyStateNoResultMRUWithoutText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "emptyStateNoResultMRUWithoutText",
      "value": "Try entering a search term."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_messageWhenBadInputDefault",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "messageWhenBadInputDefault",
      "value": "Select an option from the picklist or remove the search term."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_panelHeaderMobile",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "panelHeaderMobile",
      "value": "Relate {0} To"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_recentObject",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "recentObject",
      "value": "Recent {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_resultsListHeaderMobile",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "resultsListHeaderMobile",
      "value": "All Results for \"{0}\""
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_search",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "search",
      "value": "Search"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_searchObjectsPlaceholder",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "searchObjectsPlaceholder",
      "value": "Search {0}..."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_searchObjectsPlaceholderMobile",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "searchObjectsPlaceholderMobile",
      "value": "Search {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_searchPlaceholder",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "searchPlaceholder",
      "value": "Search..."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_searchForInObject",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "searchForInObject",
      "value": "\"{0}\" in {1}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_selectObject",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selectObject",
      "value": "Choose an object"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_typeaheadResultsListHeaderMobile",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "typeaheadResultsListHeaderMobile",
      "value": "Initial Results for \"{0}\""
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_unknownRecord",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "unknownRecord",
      "value": "Unknown record"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningLookup_none",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "none",
      "value": "None"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPicklist_available",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "available",
      "value": "Available"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPicklist_chosen",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "chosen",
      "value": "Chosen"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPicklist_noneLabel",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "noneLabel",
      "value": "--None--"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningMap_coordinatesTitle",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "coordinatesTitle",
      "value": "Markers"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningMap_openInGoogleMaps",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "openInGoogleMaps",
      "value": "Open in Google Maps"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningMap_iframeTitle",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "iframeTitle",
      "value": "Map Container"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningPrimitiveCoordinate_selected",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "selected",
      "value": "is currently selected"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningButtonMenu_loading",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "loading",
      "value": "Loading menu items..."
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningButtonMenu_showMenu",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "showMenu",
      "value": "Show menu"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTabs_overflowMore",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "overflowMore",
      "value": "More"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTabs_overflowMoreTitle",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "overflowMoreTitle",
      "value": "More Tabs"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTabs_overflowMoreAlternativeText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "overflowMoreAlternativeText",
      "value": "Tabs"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningTabs_errorStateAlternativeText",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "errorStateAlternativeText",
      "value": "This item has an error"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_Duration_secondsLater",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "secondsLater",
      "value": "in a few seconds"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_Duration_secondsAgo",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "secondsAgo",
      "value": "a few seconds ago"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningDialog_close",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "close",
      "value": "Close"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningMessageChannel_publishWithoutContext",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "publishWithoutContext",
      "value": "Lightning Message Service - Your component must be rendered before you can publish to channel: {0}"
   },
   {
      "categories": "lightning",
      "fullName": "lightning_LightningMessageChannel_invalidScope",
      "language": "en_US",
      "protected": "false",
      "shortDescription": "invalidScope",
      "value": "Lightning Message Service - Cannot subscribe to channel {0} with invalid scope: {1}"
   }
];