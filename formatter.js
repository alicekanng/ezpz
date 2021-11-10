const formatMRReminderMessage = (mr, openThreads) => {
  const {
    title = "",
    author: { name = "", username = "", avatar_url = "" },
    web_url = "",
    source_branch = "",
    target_branch = "",
    assignees = [],
    merge_status = "",
    approvals_before_merge = 0,
  } = mr;
  return {
    attachments: [
      {
        fallback: `${name} has a merge request to helpful-stuff`,
        color: "#36a64f",
        pretext: `:envelope_with_arrow: ${name} has a merge request to helpful-stuff`,
        author_name: name,
        author_link: `https://gitlab.com/${username}`,
        author_icon: avatar_url,
        title,
        title_link: web_url,
        fields: [
          {
            title: "Source:",
            value: `<${web_url}/tree/${source_branch}|${source_branch}>`,
            short: true,
          },
          {
            title: "Target:",
            value: `<${web_url}/tree/${target_branch}|${target_branch}>`,
            short: true,
          },
          {
            title: "Assignee:",
            value: assignees[0]
              ? assignees[0].name
              : "No one is assigned to this MR",
            short: false,
          },
          {
            title: "Merge Status:",
            value:
              merge_status === "can_be_merged"
                ? "This merge request can be merged!"
                : `Need ${approvals_before_merge} more approvals`,
            short: false,
          },
        ].concat(
          openThreads.map((openThread) => ({
            title: `Unresolved comment opened by ${openThread.author.name}:`,
            value: openThread.body,
            short: false,
          }))
        ),
        actions: [
          {
            name: "sub",
            text: "Subscribe",
            type: "button",
            value: "subscribe",
          },
        ],
        footer: "Gitlab Webhook",
        footer_icon: avatar_url,
        ts: Date.now(),
      },
    ],
  };
};

const formatOpenMRBlock = (mr) => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\n*${mr.title}*`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Repository:*\nHelpful Stuff",
          },
          {
            type: "mrkdwn",
            text: `*Author:*\n${mr.author.name}`,
          },
          {
            type: "mrkdwn",
            text: `*Date Opened:*\n${mr.created_at}`,
          },
          {
            type: "mrkdwn",
            text: `*Last Updated:*\n${mr.updated_at}`,
          },
          {
            type: "mrkdwn",
            text: `*Assignee:*\n${mr.assignee?.name}`,
          },
          {
            type: "mrkdwn",
            text: `*Has Conflicts:*\n${mr.has_conflicts}`,
          },
          {
            type: "mrkdwn",
            text: `*Blocking Discussions Resolved:*\n${mr.blocking_discussions_resolved}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "View on Gitlab",
            },
            style: "primary",
            value: "click_me_123",
            url: mr.web_url,
          },
        ],
      },
    ],
  };
};

const formatMREventMessage = (type, body) => {
  switch (type) {
    case "Push Hook": {
      const {
        user_name = "",
        user_avatar = "",
        ref = "",
        project: { name = "", web_url = "" },
        commits = [],
        total_commits_count = 0,
      } = body;
      return {
        attachments: [
          {
            fallback: `${user_name} pushed ${total_commits_count} commit(s) to ${ref} at ${name}`,
            color: "#36a64f",
            pretext: `:chart_with_upwards_trend: *${user_name}* pushed ${total_commits_count} commit(s) to *${ref}* at <${web_url}|${name}>:`,
            title: "Commits:",
            fields: commits.map(({ id, message, url }) => {
              return {
                value: `<${url}|${id.substring(0, 8)}>: ${message}`,
              };
            }),
            footer: "Gitlab Webhook",
            footer_icon: user_avatar,
            ts: Date.now(),
          },
        ],
      };
    }
    case "Merge Request Hook": {
      const {
        user: {
          name: user_name = "",
          username: user_username = "",
          avatar_url = "",
        },
        ref = "",
        project: { name: project_name = "", web_url = "" },
        object_attributes: {
          description = "",
          source_branch = "",
          target_branch = "",
          title = "",
          url = "",
          action = "",
        },
        assignees = [],
      } = body;
      const isMRApproval = action === "approval";
      const isMRUnapproval = action === "unapproval";
      const isMRUpdate = action === "update";
      return {
        attachments: [
          {
            fallback: isMRUpdate
              ? `${user_name} updated a merge request in ${project_name}`
              : isMRUnapproval
              ? `${user_name} unapproved a merge request in ${project_name}`
              : isMRApproval
              ? `${user_name} approved a merge request in ${project_name}`
              : `${user_name} submitted a merge request to ${project_name}`,
            color: "#36a64f",
            pretext: isMRUpdate
              ? `:pencil: *${user_name} updated a merge request in ${project_name}*`
              : isMRUnapproval
              ? `:x: *${user_name} unapproved a merge request in ${project_name}*`
              : isMRApproval
              ? `:white_check_mark: *${user_name} approved a merge request in ${project_name}*`
              : `:computer: *${user_name} submitted a merge request to ${project_name}*`,
            author_name: user_name,
            author_link: `https://gitlab.com/${user_username}`,
            author_icon: avatar_url,
            title,
            title_link: url,
            text: description,
            fields: [
              {
                title: "Source:",
                value: `<${web_url}/tree/${source_branch}|${source_branch}>`,
                short: true,
              },
              {
                title: "Target:",
                value: `<${web_url}/tree/${target_branch}|${target_branch}>`,
                short: true,
              },
              {
                title: "Assignee:",
                value: assignees[0]
                  ? assignees[0].name
                  : "No one is assigned to this MR",
                short: false,
              },
            ],
            actions: [
              {
                name: "sub",
                text: "Subscribe",
                type: "button",
                value: "subscribe",
              },
            ],
            footer: "Gitlab Webhook",
            footer_icon: avatar_url,
            ts: Date.now(),
          },
        ],
      };
    }
    case "Note Hook": {
      const {
        user: {
          name: user_name = "",
          username: user_username = "",
          avatar_url = "",
        },
        ref = "",
        project: { name: project_name = "", web_url = "" },
        object_attributes: { description = "" },
        merge_request: { title = "", url = "" },
        assignees = [],
      } = body;
      return {
        attachments: [
          {
            fallback: `${user_name} commented on a merge request in ${project_name}`,
            color: "#36a64f",
            pretext: `:speech_balloon: *${user_name} commented on a merge request in ${project_name}*`,
            author_name: user_name,
            author_link: `https://gitlab.com/${user_username}`,
            author_icon: avatar_url,
            title,
            title_link: url,
            text: description,
            footer: "Gitlab Webhook",
            footer_icon: avatar_url,
            ts: Date.now(),
          },
        ],
      };
    }
    case "Pipeline Hook": {
      const {
        user: {
          name: user_name = "",
          username: user_username = "",
          avatar_url = "",
        },
        project: { name: project_name = "" },
        object_attributes: { ref = "" },
        builds = [],
      } = body;
      return {
        attachments: [
          {
            fallback: `A pipeline triggered by ${user_name} on branch ${ref} in ${project_name} has failed!`,
            color: "#36a64f",
            pretext: `:warning: A pipeline triggered by *${user_name}* on branch *${ref}* in *${project_name}* has failed!`,
            fields: builds
              .filter(({ status }) => status === "failed")
              .map(({ name, status }) => {
                return {
                  title: name,
                  value: status,
                  short: true,
                };
              }),
            footer: "Gitlab Webhook",
            footer_icon: avatar_url,
            ts: Date.now(),
          },
        ],
      };
    }
    default:
      return {};
  }
};

module.exports = {
  formatMREventMessage,
  formatOpenMRBlock,
  formatMRReminderMessage,
};
