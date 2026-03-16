/**
 * API服务统一导出
 * 提供所有API服务的统一入口
 */

import userService from './userService';
import classService from './classService';
import synonymService from './synonymService';
import photoService from './photoService';

export {
  userService,
  classService,
  synonymService,
  photoService
};

export default {
  userService,
  classService,
  synonymService,
  photoService
};