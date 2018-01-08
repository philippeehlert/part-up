/**
 * Error function for global use
 *
 * @class error
 * @memberof Partup.client
 */
Partup.client.error = function(context, msg) {
  let full_msg = context + ': ' + msg;
  let err = new Error(full_msg);
  console.error(err);
  return;
};
