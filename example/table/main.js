import React from 'react';
import ReactDOM from 'react-dom';
import { DataTable } from 'react-data-components';

function buildTable(api, param) {
  const renderMapUrl =
    (val, row) =>
      <a href={`https://www.google.com/maps?q=${row['lat']},${row['long']}`}>
        Google Maps
      </a>;

  const tableColumns = [
    { title: 'id', prop: 'id' },
    { title: 'query', prop: 'query'},
    { title: '对话Id', prop: 'dialog_id'},
    { title: '来源', prop: 'source'},
    { title: '类别', prop: 'category'}
  ]

  const queryStatus={
    0: "未标注",
    1: "类别已标",
    2: "属性已标"
  }

  const columns = [
        { title: 'ID', prop: 'queryId', width: "4%" },
        { title: '对话Id', prop: 'dialogId', width: "4%" },
        { title: '问题', prop: 'query', width: "20%" },
        { title: '来源', prop: 'source', width: "4%" },
        { title: '状态', prop: 'status', width: "4%", render:(v,r)=>queryStatus[v]},
        { title: '领取数', prop: 'takeCount', width: "4%"  },
        { title: '标注数', prop: 'labelCount', width: "4%"  },
        { title: '场景通用', prop: 'isGeneral', width: "4%", render: (v, r) => {
          if (v == null) return "未标注";
          else if (v == 0) return "不通用"; else return "通用";
        }  },
        { title: '入库类别', prop: 'category', width: "8%" },
        { title: '标注1', prop: 'label1', width: "18%" , className: "sub-table", render: (v, r) => JSON.stringify(v) },
        { title: '标注2', prop: 'label2', width: "18%" , className: "sub-table", render: (v, r) => JSON.stringify(v) },
        { title: '导入时间', prop: 'importTime', width: "6%"  },
        { title: '标注时间', prop: 'labelTime', width: "6%"  },
        { title: '修改', prop: 'edit', width: "4%", render: (v, r) => (
          <div>
            <button type="button" className="btn blue">修改</button>
          </div>
        )}
  ];

  return (
    <DataTable
      className="container"
      keys="id"
      columns={columns}
      initialData={[]}
      initialPageLength={5}
      initialSortBy={{ prop: 'city', order: 'descending' }}
      pageLengthOptions={[ 5, 20, 50 ]}
      api={api}
      initialApiParam={param}
    />
  );
}

ReactDOM.render(
  buildTable("/api/tasks", {label_type:"category", task_type: "all"}),
  document.getElementById('root')
);

//fetch('/data.json')
//  .then(res => res.json())
//  .then((rows) => {
//    ReactDOM.render(buildTable(rows), document.getElementById('root'));
//  });
