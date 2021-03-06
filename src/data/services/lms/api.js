import { StrictDict } from 'utils';
import { locationId } from 'data/constants/app';
import { paramKeys } from './constants';
import urls from './urls';
import {
  client,
  get,
  post,
  stringifyUrl,
} from './utils';

/*********************************************************************************
 * GET Actions
 *********************************************************************************/

/**
 * get('/api/initialize', { ora_location, course_id? })
 * @return {
 *   oraMetadata: { name, prompt, type ('individual' vs 'team'), rubricConfig, fileUploadResponseConfig },
 *   courseMetadata: { courseOrg, courseName, courseNumber, courseId },
 *   submissions: {
 *     [submissionUUID]: {
 *       id: <submissionUUID>, (not currently used)
 *       username
 *       submissionUUID
 *       dateSubmitted (timestamp)
 *       gradeStatus (['ungraded', 'graded', 'locked', 'locked_by_you'?])
 *       grade: { pointsEarned, pointsPossible }
 *     },
 *     ...
 *   },
 * }
 */
const initializeApp = () => get(
  stringifyUrl(urls.oraInitializeUrl, {
    [paramKeys.oraLocation]: locationId,
  }),
).then(response => response.data);

/**
 * get('/api/submission', { submissionUUID })
 * @return {
 *   submision: {
 *     gradeData,
 *     gradeStatus,
 *     response: { files: [{}], text: <html> },
 *   },
 * }
 */
const fetchSubmission = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * fetches the current grade, gradeStatus, and rubricResponse data for the given submission
 * get('/api/submissionStatus', { submissionUUID })
 *   @return {obj} submissionStatus object
 *   {
 *     gradeData,
 *     gradeStatus,
 *     lockStatus,
 *   }
 */
const fetchSubmissionStatus = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionStatusUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);
/**
 * Fetches only the learner response for a given submission. Used for pre-fetching response
 * for neighboring submissions in the queue.
 */
export const fetchSubmissionResponse = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * post('api/lock', { ora_location, submissionUUID });
 * @param {string} submissionUUID
 */
const lockSubmission = (submissionUUID) => post(
  stringifyUrl(urls.fetchSubmissionLockUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);
/**
 * unlockSubmission(submissionUUID)
 * @param {string} submissionUUID
 */
const unlockSubmission = (submissionUUID) => client().delete(
  stringifyUrl(urls.fetchSubmissionLockUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/*
 * post('api/updateGrade', { submissionUUID, gradeData })
 * @param {object} gradeData - full grading submission data
 */
const updateGrade = (submissionUUID, gradeData) => post(
  stringifyUrl(urls.updateSubmissionGradeUrl, {
    [paramKeys.oraLocation]: locationId,
    [paramKeys.submissionUUID]: submissionUUID,
  }),
  gradeData,
).then(response => response.data);

export default StrictDict({
  initializeApp,
  fetchSubmission,
  fetchSubmissionResponse,
  fetchSubmissionStatus,
  lockSubmission,
  updateGrade,
  unlockSubmission,
});
