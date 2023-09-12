/* eslint-disable no-param-reassign */
import { HttpMessage } from '../constrant/httpMessage';
import { exec } from 'child_process';
import { KnexModule } from 'nest-knexjs';

export const portCreateAnsible = async (ansibleObj, ports, logData, knex) => {
  console.log(
    'create_port_ansible_script==>',
    `bash /opt/inq-fabric-orchestration/port/create_port.sh -p '${ansibleObj.pod_name}' -v '${ansibleObj.sp_vlan_id}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
  );
  exec(
    `bash /opt/inq-fabric-orchestration/port/create_port.sh -p '${ansibleObj.pod_name}' -v '${ansibleObj.sp_vlan_id}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
    async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error}`);
        console.log(`stdout: ${stdout}`);
        // logData.ansibleRequest = `bash /opt/inq-fabric-orchestration/port/create_port.sh -p '${ansibleObj.pod_name}' -v '${ansibleObj.sp_vlan_id}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`;
        // logData.ansibleResponse = stdout;
        // await logData.save();
        await knex('port')
          .where({ id: ports[0].id })
          .update({ admin_status: 'Provisioning' });
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        await knex('port')
          .where({ id: ports[0].id })
          .update({ admin_status: 'Provisioning' });
        return;
      }
      if (stdout) {
        // logData.ansibleRequest = `bash /opt/inq-fabric-orchestration/port/create_port.sh -p '${ansibleObj.pod_name}' -v '${ansibleObj.sp_vlan_id}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`;
        // logData.ansibleResponse = stdout;
        // await logData.save();
        // console.log(`stdout: ${stdout}`);
        // await Port.findByIdAndUpdate(
        //   ports._id,
        //   {
        //     admin_status: 'Deployable',
        //   },
        //   { new: true },
        // );
        return;
      }
    },
  );
};

// exports.portDeleteAnsible = async (req, res, portData) => {
//   // Ansible Object
//   const ansibleObj = {
//     port_code: portData.port_code,
//     sp_vlan_name: portData.sp_vlan_name,
//     ha: 'no',
//   };
//   console.log(
//     'delete_port_ansible_script ==>',
//     `bash /opt/inq-fabric-orchestration/port/delete_port.sh -p '${ansibleObj.port_code}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
//   );
//   exec(
//     `bash /opt/inq-fabric-orchestration/port/delete_port.sh -p '${ansibleObj.port_code}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
//     async (error, stdout, stderr) => {
//       let logData;
//       if (error) {
//         console.log(`error: ${error}`);
//         console.log(`stdout: ${stdout}`);
//         // create logs for ansible
//         logData = await Log.create({
//           ansibleRequest: `bash /opt/inq-fabric-orchestration/port/delete_port.sh -p '${ansibleObj.port_code}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
//           ansibleResponse: stdout,
//         });
//         return res.error({ message: stdout });
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return res.error({ message: stderr });
//       }
//       if (stdout) {
//         console.log(`stdout: ${stdout}`);
//         // create logs for ansible
//         logData = await Log.create({
//           ansibleRequest: `bash /opt/inq-fabric-orchestration/port/delete_port.sh -p '${ansibleObj.port_code}' -n '${ansibleObj.sp_vlan_name}' -h ${ansibleObj.ha}`,
//           ansibleResponse: stdout,
//         });
//         try {
//           // delete port data
//           const deletebyid = await Port.findByIdAndRemove(req.params.id);
//           if (!deletebyid) {
//             return res.error({ message: HttpMessage.NOT_FOUND });
//           }
//           if (deletebyid) {
//             if (deletebyid.status === 'Order') {
//               // create a log for port
//               logData.user = {
//                 email: deletebyid.user.email,
//                 name: deletebyid.user.name,
//               };
//               logData.org = {
//                 code: deletebyid.org.code,
//                 name: deletebyid.org.name,
//               };
//               logData.log_type = 'port';
//               logData.action = 'delete';
//               logData.category = 'user';
//               logData.dis_id = deletebyid.display_port_id;
//               logData.port = deletebyid._id;
//               logData.speed = deletebyid.port_speed;
//               logData.name = deletebyid.name;
//               // save logs
//               await logData.save();
//               // device data for the port
//               const deviceData = await Device.findOne({
//                 pod_id: deletebyid.pod,
//               });
//               if (deviceData) {
//                 // update device
//                 const updatedSp_vlan = Number(deletebyid.sp_vlan_id);
//                 await Device.updateOne(
//                   { pod_id: deletebyid.pod },
//                   {
//                     $set: {
//                       available_ports: deviceData.available_ports + Number(1),
//                     },
//                     $pull: {
//                       Used_ports: deletebyid._id,
//                       'sp_vlan.Used_sp_vlan': updatedSp_vlan,
//                     },
//                     $push: {
//                       'sp_vlan.available_sp_vlan': updatedSp_vlan,
//                     },
//                   },
//                   { new: true },
//                 );
//                 return res.success({
//                   message: HttpMessage.DELETE_ORDER_PORT,
//                   result: deletebyid,
//                 });
//               }
//             } else {
//               return res.success({
//                 message: HttpMessage.DELETE_SAVED_PORT,
//                 result: deletebyid,
//               });
//             }
//           }
//         } catch (err) {
//           console.log(err);
//           return res.error({
//             statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//             errors: err.message,
//             message: HttpMessage.INTERNAL_SERVER_ERROR,
//           });
//         }
//       }
//     },
//   );
// };
